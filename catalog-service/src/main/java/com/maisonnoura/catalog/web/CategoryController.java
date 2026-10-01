package com.maisonnoura.catalog.web;

import com.maisonnoura.catalog.model.Category;
import com.maisonnoura.catalog.service.CatalogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CatalogService service;

    @GetMapping
    public List<Category> list() {
        return service.allCategories();
    }

    @GetMapping("/{id}")
    public Category get(@PathVariable Long id) {
        return service.category(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Category create(@Valid @RequestBody Category category) {
        category.setId(null);
        return service.saveCategory(category);
    }

    @PutMapping("/{id}")
    public Category update(@PathVariable Long id, @Valid @RequestBody Category category) {
        return service.updateCategory(id, category);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.deleteCategory(id);
    }
}
