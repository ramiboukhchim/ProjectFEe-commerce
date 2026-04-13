package org.example.projectecommerce.repository;

import org.example.projectecommerce.entity.Commande;
import org.example.projectecommerce.entity.LigneCommande;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List; // Added missing import

public interface CommandeRepository extends JpaRepository<Commande, Long> {
}
