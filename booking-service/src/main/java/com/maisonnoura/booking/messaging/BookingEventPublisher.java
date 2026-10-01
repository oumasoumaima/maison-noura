package com.maisonnoura.booking.messaging;

import com.maisonnoura.booking.config.RabbitConfig;
import com.maisonnoura.booking.model.Appointment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class BookingEventPublisher {

    private final RabbitTemplate rabbit;

    public void publish(String routingKey, Appointment appointment) {
        try {
            rabbit.convertAndSend(RabbitConfig.EXCHANGE, routingKey, BookingEvent.from(routingKey, appointment));
            log.info("Événement {} publié pour le RDV #{}", routingKey, appointment.getId());
        } catch (AmqpException e) {
            // Le RDV est déjà enregistré : on ne fait pas échouer la requête si le broker est indisponible.
            // Amélioration possible : pattern "transactional outbox".
            log.error("Impossible de publier {} pour le RDV #{}", routingKey, appointment.getId(), e);
        }
    }
}
