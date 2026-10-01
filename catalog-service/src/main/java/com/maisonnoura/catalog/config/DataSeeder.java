package com.maisonnoura.catalog.config;

import com.maisonnoura.catalog.model.Category;
import com.maisonnoura.catalog.model.Prestation;
import com.maisonnoura.catalog.repository.CategoryRepository;
import com.maisonnoura.catalog.repository.PrestationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/** Données de démonstration, insérées uniquement si la base est vide. */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categories;
    private final PrestationRepository prestations;

    @Override
    public void run(String... args) {
        if (categories.count() > 0) return;

        Category coiffure = categories.save(new Category("Coiffure", "Coupes, couleurs et soins capillaires"));
        Category visage = categories.save(new Category("Soins du visage", "Nettoyage, éclat et hydratation"));
        Category ongles = categories.save(new Category("Ongles", "Manucure et pose de vernis"));
        Category hammam = categories.save(new Category("Hammam & gommage", "Rituels traditionnels de détente"));

        add("Brushing", "Shampoing et mise en forme", 150, 30, coiffure);
        add("Coloration", "Couleur complète, diagnostic inclus", 450, 90, coiffure);
        add("Soin à la kératine", "Lissage nourrissant longue durée", 700, 120, coiffure);
        add("Nettoyage de peau", "Purification profonde et masque", 350, 60, visage);
        add("Soin éclat", "Gommage doux, sérum et massage du visage", 500, 75, visage);
        add("Manucure classique", "Soin des mains et pose de vernis", 200, 45, ongles);
        add("Pose de gel", "Pose complète avec finition au choix", 350, 75, ongles);
        add("Hammam beldi", "Savon noir, gommage au kessa et rinçage", 300, 60, hammam);
    }

    private void add(String name, String description, int price, int minutes, Category category) {
        Prestation p = new Prestation();
        p.setName(name);
        p.setDescription(description);
        p.setPrice(BigDecimal.valueOf(price));
        p.setDurationMinutes(minutes);
        p.setCategory(category);
        prestations.save(p);
    }
}
