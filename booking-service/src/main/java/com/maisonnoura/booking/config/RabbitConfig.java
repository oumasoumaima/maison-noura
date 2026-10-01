package com.maisonnoura.booking.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    public static final String EXCHANGE = "booking.exchange";
    public static final String ROUTING_CREATED = "booking.created";
    public static final String ROUTING_STATUS_CHANGED = "booking.status.changed";

    @Bean
    TopicExchange bookingExchange() {
        return new TopicExchange(EXCHANGE, true, false);
    }

    /** Sérialise les événements en JSON (avec l'ObjectMapper de Spring Boot). */
    @Bean
    MessageConverter jsonMessageConverter(ObjectMapper objectMapper) {
        return new Jackson2JsonMessageConverter(objectMapper);
    }
}
