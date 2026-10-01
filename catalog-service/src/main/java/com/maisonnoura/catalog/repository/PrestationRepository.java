package com.maisonnoura.catalog.repository;

import com.maisonnoura.catalog.model.Prestation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrestationRepository extends JpaRepository<Prestation, Long> {
    List<Prestation> findByCategoryIdOrderByName(Long categoryId);
    boolean existsByCategoryId(Long categoryId);
}
