package com.maisonnoura.notification.listener;

import com.maisonnoura.notification.config.RabbitConfig;
import com.maisonnoura.notification.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Slf4j
@Component
@RequiredArgsConstructor
public class BookingEventListener {

    private static final DateTimeFormatter WHEN =
            DateTimeFormatter.ofPattern("EEEE d MMMM 'à' HH'h'mm", Locale.FRENCH);

    private final EmailService emails;

    @RabbitListener(queues = RabbitConfig.QUEUE)
    public void onBookingEvent(BookingEvent e) {
        log.info("Événement reçu : {} (RDV #{}, statut {})", e.eventType(), e.appointmentId(), e.status());

        String when = e.startTime().format(WHEN);
        String hello = "Bonjour " + e.customerName() + ",\n\n";
        String bye = "\n\nÀ bientôt,\nL'équipe Maison Noura";

        switch (e.status()) {
            case "EN_ATTENTE" -> emails.send(e.customerEmail(), "Demande de rendez-vous reçue",
                    hello + "Nous avons bien reçu votre demande pour « " + e.prestationName() + " » le " + when
                            + ".\nNous vous confirmons votre rendez-vous très rapidement." + bye);
            case "CONFIRME" -> emails.send(e.customerEmail(), "Rendez-vous confirmé",
                    hello + "Votre rendez-vous « " + e.prestationName() + " » est confirmé pour le " + when + "." + bye);
            case "ANNULE" -> emails.send(e.customerEmail(), "Rendez-vous annulé",
                    hello + "Votre rendez-vous « " + e.prestationName() + " » du " + when
                            + " a été annulé. N'hésitez pas à reprendre rendez-vous sur notre site." + bye);
            case "TERMINE" -> emails.send(e.customerEmail(), "Merci de votre visite",
                    hello + "Merci d'avoir choisi Maison Noura pour « " + e.prestationName() + " »." + bye);
            default -> log.warn("Statut inconnu : {}", e.status());
        }
    }
}
