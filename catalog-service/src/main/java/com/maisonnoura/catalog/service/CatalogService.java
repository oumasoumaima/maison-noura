package com.maisonnoura.catalog.service;

import com.maisonnoura.catalog.model.Category;
import com.maisonnoura.catalog.model.Prestation;
import com.maisonnoura.catalog.model.PrestationRequest;
import com.maisonnoura.catalog.repository.CategoryRepository;
import com.maisonnoura.catalog.repository.PrestationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatalogService {

    private final CategoryRepository categories;
    private final PrestationRepository prestations;

    // ---------- Catégories ----------
    public List<Category> allCategories() {
        return categories.findAll();
    }

    public Category category(Long id) {
        return categories.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Catégorie introuvable"));
    }

    public Category saveCategory(Category category) {
        return categories.save(category);
    }

    public Category updateCategory(Long id, Category data) {
        Category existing = category(id);
        existing.setName(data.getName());
        existing.setDescription(data.getDescription());
        return categories.save(existing);
    }

    public void deleteCategory(Long id) {
        Category existing = category(id);
        if (prestations.existsByCategoryId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Cette catégorie contient encore des prestations");
        }
        categories.delete(existing);
    }

    // ---------- Prestations ----------
    public List<Prestation> allPrestations(Long categoryId) {
        return categoryId == null ? prestations.findAll() : prestations.findByCategoryIdOrderByName(categoryId);
    }

    public Prestation prestation(Long id) {
        return prestations.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prestation introuvable"));
    }

    @Transactional
    public Prestation createPrestation(PrestationRequest req) {
        return prestations.save(apply(new Prestation(), req));
    }

    @Transactional
    public Prestation updatePrestation(Long id, PrestationRequest req) {
        return prestations.save(apply(prestation(id), req));
    }

    public void deletePrestation(Long id) {
        prestations.delete(prestation(id));
    }

    private Prestation apply(Prestation p, PrestationRequest req) {
        p.setName(req.name());
        p.setDescription(req.description());
        p.setPrice(req.price());
        p.setDurationMinutes(req.durationMinutes());
        p.setImageUrl(req.imageUrl());
        p.setCategory(category(req.categoryId()));
        return p;
    }
}
