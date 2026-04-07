package org.example.projectecommerce.repository;

import org.example.projectecommerce.entity.Panier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PanierRepository extends JpaRepository<Panier, Long> {
}
