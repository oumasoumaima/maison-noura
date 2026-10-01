package com.maisonnoura.catalog.repository;

import com.maisonnoura.catalog.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
