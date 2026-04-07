package org.example.projectecommerce.repository;

import org.example.projectecommerce.entity.Commande;
import org.example.projectecommerce.entity.LigneCommande;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommandeRepository extends JpaRepository<Commande, Long> {
}
