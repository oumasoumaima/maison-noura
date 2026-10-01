package com.maisonnoura.booking.web;

import com.maisonnoura.booking.model.Appointment;
import com.maisonnoura.booking.model.AppointmentStatus;
import com.maisonnoura.booking.model.CreateAppointmentRequest;
import com.maisonnoura.booking.model.StatusRequest;
import com.maisonnoura.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AppointmentController {

    private final BookingService service;

    /** Public : créneaux libres pour une prestation un jour donné. */
    @GetMapping("/slots")
    public List<LocalTime> slots(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                 @RequestParam Long prestationId) {
        return service.availableSlots(date, prestationId);
    }

    /** Public : prendre rendez-vous. */
    @PostMapping("/appointments")
    @ResponseStatus(HttpStatus.CREATED)
    public Appointment create(@Valid @RequestBody CreateAppointmentRequest request) {
        return service.create(request);
    }

    /** Admin : liste filtrable. */
    @GetMapping("/appointments")
    public List<Appointment> list(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                  @RequestParam(required = false) AppointmentStatus status) {
        return service.list(date, status);
    }

    @GetMapping("/appointments/{id}")
    public Appointment get(@PathVariable Long id) {
        return service.get(id);
    }

    /** Admin : confirmer, annuler ou terminer un rendez-vous. */
    @PatchMapping("/appointments/{id}/status")
    public Appointment updateStatus(@PathVariable Long id, @Valid @RequestBody StatusRequest request) {
        return service.updateStatus(id, request.status());
    }
}
