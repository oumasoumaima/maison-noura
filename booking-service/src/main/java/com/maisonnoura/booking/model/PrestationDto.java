package com.maisonnoura.booking.model;

import java.math.BigDecimal;

/** Vue minimale d'une prestation renvoyée par le Catalog Service. */
public record PrestationDto(Long id, String name, BigDecimal price, int durationMinutes) {
}
