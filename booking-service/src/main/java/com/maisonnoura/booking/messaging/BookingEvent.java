package com.maisonnoura.booking.messaging;

import com.maisonnoura.booking.model.Appointment;

import java.time.LocalDateTime;

/** Contrat de l'événement publié sur RabbitMQ (le Notification Service en a sa propre copie). */
public record BookingEvent(
        String eventType,
        Long appointmentId,
        String customerName,
        String customerEmail,
        String prestationName,
        LocalDateTime startTime,
        String status) {

    public static BookingEvent from(String eventType, Appointment a) {
        return new BookingEvent(eventType, a.getId(), a.getCustomerName(), a.getCustomerEmail(),
                a.getPrestationName(), a.getStartTime(), a.getStatus().name());
    }
}
