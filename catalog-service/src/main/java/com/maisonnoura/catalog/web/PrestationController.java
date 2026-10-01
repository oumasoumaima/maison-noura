package com.maisonnoura.catalog.web;

import com.maisonnoura.catalog.model.Prestation;
import com.maisonnoura.catalog.model.PrestationRequest;
import com.maisonnoura.catalog.service.CatalogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prestations")
@RequiredArgsConstructor
public class PrestationController {

    private final CatalogService service;

    @GetMapping
    public List<Prestation> list(@RequestParam(required = false) Long categoryId) {
        return service.allPrestations(categoryId);
    }

    @GetMapping("/{id}")
    public Prestation get(@PathVariable Long id) {
        return service.prestation(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Prestation create(@Valid @RequestBody PrestationRequest request) {
        return service.createPrestation(request);
    }

    @PutMapping("/{id}")
    public Prestation update(@PathVariable Long id, @Valid @RequestBody PrestationRequest request) {
        return service.updatePrestation(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.deletePrestation(id);
    }
}
