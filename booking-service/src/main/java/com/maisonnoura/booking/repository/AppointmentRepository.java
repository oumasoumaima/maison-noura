package com.maisonnoura.booking.repository;

import com.maisonnoura.booking.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    /** RDV actifs (EN_ATTENTE / CONFIRME) qui chevauchent l'intervalle [start, end[. */
    @Query("""
            select a from Appointment a
            where a.status in (com.maisonnoura.booking.model.AppointmentStatus.EN_ATTENTE,
                               com.maisonnoura.booking.model.AppointmentStatus.CONFIRME)
              and a.startTime < :end and a.endTime > :start
            """)
    List<Appointment> findActiveOverlapping(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    List<Appointment> findByStartTimeBetweenOrderByStartTime(LocalDateTime from, LocalDateTime to);

    List<Appointment> findAllByOrderByStartTimeDesc();

    /**
     * Verrou applicatif PostgreSQL, libéré à la fin de la transaction.
     * Sérialise les réservations concurrentes : empêche deux clients de prendre le même dernier créneau.
     */
    @Query(value = "SELECT CAST(pg_advisory_xact_lock(:key) AS text)", nativeQuery = true)
    String lockBookings(@Param("key") long key);
}
