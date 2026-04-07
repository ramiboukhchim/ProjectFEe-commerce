package org.example.projectecommerce.repository;

import org.example.projectecommerce.entity.LigneCommande;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LigneCommandeRepository extends JpaRepository<LigneCommande, Long> {
    List<LigneCommande> findByPanierId(Long panierId);

    List<LigneCommande> findAllByPanierIdAndProductId(Long panierId, Long productId);
}
