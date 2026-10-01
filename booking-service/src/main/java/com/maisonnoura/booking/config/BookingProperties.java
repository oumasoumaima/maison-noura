package com.maisonnoura.booking.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.util.Set;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "booking")
public class BookingProperties {
    /** Heure d'ouverture, format HH:mm */
    private String opening = "09:00";
    /** Heure de fermeture, format HH:mm */
    private String closing = "19:00";
    /** Pas de la grille de créneaux, en minutes */
    private int slotStepMinutes = 30;
    /** Nombre de rendez-vous simultanés possibles (nombre d'employées) */
    private int capacity = 2;
    private Set<DayOfWeek> closedDays = Set.of(DayOfWeek.SUNDAY);
    private String catalogUrl = "http://localhost:8081";
}
