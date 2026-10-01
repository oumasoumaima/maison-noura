package com.maisonnoura.booking.model;

import jakarta.validation.constraints.NotNull;

public record StatusRequest(@NotNull AppointmentStatus status) {
}
