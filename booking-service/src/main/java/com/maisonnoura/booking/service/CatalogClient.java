package com.maisonnoura.booking.service;

import com.maisonnoura.booking.config.BookingProperties;
import com.maisonnoura.booking.model.PrestationDto;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

/** Appel synchrone au Catalog Service pour connaître la durée d'une prestation. */
@Component
public class CatalogClient {

    private final RestClient rest;

    public CatalogClient(BookingProperties props, RestClient.Builder builder) {
        this.rest = builder.baseUrl(props.getCatalogUrl()).build();
    }

    public PrestationDto getPrestation(Long id) {
        try {
            return rest.get().uri("/api/prestations/{id}", id).retrieve().body(PrestationDto.class);
        } catch (HttpClientErrorException.NotFound e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Prestation introuvable");
        } catch (RestClientException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Catalogue momentanément indisponible");
        }
    }
}
