package com.maisonnoura.booking.service;

import com.maisonnoura.booking.config.BookingProperties;
import com.maisonnoura.booking.config.RabbitConfig;
import com.maisonnoura.booking.messaging.BookingEventPublisher;
import com.maisonnoura.booking.model.*;
import com.maisonnoura.booking.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private static final long BOOKING_LOCK_KEY = 42L;

    private final AppointmentRepository repository;
    private final CatalogClient catalog;
    private final BookingProperties props;
    private final BookingEventPublisher events;
    private final TransactionTemplate tx;

    // ------------------------------------------------------------------
    // Créneaux disponibles pour une date et une prestation
    // ------------------------------------------------------------------
    public List<LocalTime> availableSlots(LocalDate date, Long prestationId) {
        PrestationDto prestation = catalog.getPrestation(prestationId);
        List<LocalTime> slots = new ArrayList<>();
        if (props.getClosedDays().contains(date.getDayOfWeek())) return slots;

        LocalDateTime open = date.atTime(LocalTime.parse(props.getOpening()));
        LocalDateTime close = date.atTime(LocalTime.parse(props.getClosing()));
        List<Appointment> busy = repository.findActiveOverlapping(open, close);
        LocalDateTime now = LocalDateTime.now();

        for (LocalDateTime start = open;
             !start.plusMinutes(prestation.durationMinutes()).isAfter(close);
             start = start.plusMinutes(props.getSlotStepMinutes())) {
            LocalDateTime end = start.plusMinutes(prestation.durationMinutes());
            if (start.isAfter(now) && countOverlaps(busy, start, end) < props.getCapacity()) {
                slots.add(start.toLocalTime());
            }
        }
        return slots;
    }

    // ------------------------------------------------------------------
    // Création d'un rendez-vous
    // ------------------------------------------------------------------
    public Appointment create(CreateAppointmentRequest req) {
        PrestationDto prestation = catalog.getPrestation(req.prestationId());   // appel HTTP hors transaction
        LocalDateTime start = req.startTime();
        LocalDateTime end = start.plusMinutes(prestation.durationMinutes());
        validateSlot(start, end);

        Appointment saved = tx.execute(status -> {
            repository.lockBookings(BOOKING_LOCK_KEY);   // sérialise les réservations concurrentes
            if (countOverlaps(repository.findActiveOverlapping(start, end), start, end) >= props.getCapacity()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Ce créneau n'est plus disponible");
            }
            Appointment a = new Appointment();
            a.setPrestationId(prestation.id());
            a.setPrestationName(prestation.name());
            a.setDurationMinutes(prestation.durationMinutes());
            a.setCustomerName(req.customerName());
            a.setCustomerEmail(req.customerEmail());
            a.setCustomerPhone(req.customerPhone());
            a.setStartTime(start);
            a.setEndTime(end);
            return repository.save(a);
        });

        events.publish(RabbitConfig.ROUTING_CREATED, saved);   // après le commit
        return saved;
    }

    // ------------------------------------------------------------------
    // Changement de statut (machine à états)
    // ------------------------------------------------------------------
    public Appointment updateStatus(Long id, AppointmentStatus target) {
        Appointment updated = tx.execute(status -> {
            Appointment a = get(id);
            if (!a.getStatus().canTransitionTo(target)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Transition impossible : " + a.getStatus() + " → " + target);
            }
            a.setStatus(target);
            return repository.save(a);
        });
        events.publish(RabbitConfig.ROUTING_STATUS_CHANGED, updated);
        return updated;
    }

    // ------------------------------------------------------------------
    // Lecture
    // ------------------------------------------------------------------
    public Appointment get(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rendez-vous introuvable"));
    }

    public List<Appointment> list(LocalDate date, AppointmentStatus status) {
        List<Appointment> result = date == null
                ? repository.findAllByOrderByStartTimeDesc()
                : repository.findByStartTimeBetweenOrderByStartTime(date.atStartOfDay(), date.plusDays(1).atStartOfDay());
        return status == null ? result : result.stream().filter(a -> a.getStatus() == status).toList();
    }

    // ------------------------------------------------------------------
    // Règles métier
    // ------------------------------------------------------------------
    private void validateSlot(LocalDateTime start, LocalDateTime end) {
        LocalDateTime open = start.toLocalDate().atTime(LocalTime.parse(props.getOpening()));
        LocalDateTime close = start.toLocalDate().atTime(LocalTime.parse(props.getClosing()));

        if (!start.isAfter(LocalDateTime.now()))
            throw bad("Le rendez-vous doit être dans le futur");
        if (props.getClosedDays().contains(start.getDayOfWeek()))
            throw bad("Le salon est fermé ce jour-là");
        if (start.isBefore(open) || end.isAfter(close))
            throw bad("Le rendez-vous doit se terminer avant la fermeture (" + props.getClosing() + ")");
        if (ChronoUnit.MINUTES.between(open, start) % props.getSlotStepMinutes() != 0)
            throw bad("Horaire non valide : les créneaux sont toutes les " + props.getSlotStepMinutes() + " minutes");
    }

    private long countOverlaps(List<Appointment> appointments, LocalDateTime start, LocalDateTime end) {
        return appointments.stream()
                .filter(a -> a.getStartTime().isBefore(end) && a.getEndTime().isAfter(start))
                .count();
    }

    private ResponseStatusException bad(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}
