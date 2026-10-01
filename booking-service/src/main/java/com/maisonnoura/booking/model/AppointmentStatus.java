package com.maisonnoura.booking.model;

public enum AppointmentStatus {
    EN_ATTENTE, CONFIRME, ANNULE, TERMINE;

    /** Machine à états : les transitions autorisées. */
    public boolean canTransitionTo(AppointmentStatus target) {
        return switch (this) {
            case EN_ATTENTE -> target == CONFIRME || target == ANNULE;
            case CONFIRME -> target == TERMINE || target == ANNULE;
            case ANNULE, TERMINE -> false;
        };
    }

    /** Un RDV en attente ou confirmé occupe un créneau. */
    public boolean blocksSlot() {
        return this == EN_ATTENTE || this == CONFIRME;
    }
}
