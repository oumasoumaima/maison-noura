package com.maisonnoura.notification.listener;

import java.time.LocalDateTime;

public record BookingEvent(
        String eventType,
        Long appointmentId,
        String customerName,
        String customerEmail,
        String prestationName,
        LocalDateTime startTime,
        String status) {
}
