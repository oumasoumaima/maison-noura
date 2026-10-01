package com.maisonnoura.booking.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record CreateAppointmentRequest(
        @NotNull Long prestationId,
        @NotBlank String customerName,
        @NotBlank @Email String customerEmail,
        String customerPhone,
        @NotNull LocalDateTime startTime) {
}
