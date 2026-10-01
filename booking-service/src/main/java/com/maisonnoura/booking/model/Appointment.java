package com.maisonnoura.booking.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Copie des infos de la prestation au moment de la réservation (pas de jointure entre services)
    @Column(nullable = false)
    private Long prestationId;
    @Column(nullable = false)
    private String prestationName;
    @Column(nullable = false)
    private int durationMinutes;

    @Column(nullable = false)
    private String customerName;
    @Column(nullable = false)
    private String customerEmail;
    private String customerPhone;

    @Column(nullable = false)
    private LocalDateTime startTime;
    @Column(nullable = false)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status = AppointmentStatus.EN_ATTENTE;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
