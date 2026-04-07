package org.example.projectecommerce.service;

import org.example.projectecommerce.entity.LigneCommande;
import org.example.projectecommerce.entity.Panier;
import org.example.projectecommerce.entity.Product;
import org.example.projectecommerce.repository.LigneCommandeRepository;
import org.example.projectecommerce.repository.PanierRepository;
import org.example.projectecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PanierService {

    @Autowired
    private PanierRepository panierRepo;

    @Autowired
    private LigneCommandeRepository ligneRepo;

    @Autowired
    private ProductRepository productRepo;

    @Transactional
    public Panier addProduct(Long panierId, Long productId, int qty) {
        if (qty <= 0) {
            throw new IllegalArgumentException("La quantite doit etre superieure a 0");
        }

        Panier panier = resolvePanier(panierId);
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));

        List<LigneCommande> lignes = ligneRepo.findAllByPanierIdAndProductId(panier.getId(), productId);
        LigneCommande ligne;

        if (lignes.isEmpty()) {
            ligne = createLigne(panier, product);
        } else {
            ligne = lignes.get(0);
            if (lignes.size() > 1) {
                mergeDuplicateLignes(ligne, lignes.subList(1, lignes.size()));
            }
        }

        ligne.setQuantite(ligne.getQuantite() + qty);
        ligneRepo.save(ligne);

        Panier updatedPanier = panierRepo.findById(panier.getId())
                .orElseThrow(() -> new RuntimeException("Panier introuvable"));
        updatedPanier.setLignes(ligneRepo.findByPanierId(updatedPanier.getId()));
        return updatedPanier;
    }

    @Transactional(readOnly = true)
    public List<LigneCommande> getPanier(Long panierId) {
        if (!panierRepo.existsById(panierId)) {
            throw new RuntimeException("Panier introuvable");
        }
        return ligneRepo.findByPanierId(panierId);
    }

    @Transactional
    public void removeProduct(Long panierId, Long ligneId) {
        LigneCommande ligne = ligneRepo.findById(ligneId)
                .orElseThrow(() -> new RuntimeException("Ligne introuvable"));

        if (ligne.getPanier() == null || !ligne.getPanier().getId().equals(panierId)) {
            throw new RuntimeException("Cette ligne n'appartient pas au panier");
        }

        ligneRepo.delete(ligne);
    }

    private Panier resolvePanier(Long panierId) {
        if (panierId == null) {
            return panierRepo.save(new Panier());
        }
        return panierRepo.findById(panierId)
                .orElseGet(() -> panierRepo.save(new Panier()));
    }

    private LigneCommande createLigne(Panier panier, Product product) {
        LigneCommande ligne = new LigneCommande();
        ligne.setPanier(panier);
        ligne.setProduct(product);
        ligne.setQuantite(0);
        panier.getLignes().add(ligne);
        return ligne;
    }

    private void mergeDuplicateLignes(LigneCommande target, List<LigneCommande> duplicates) {
        int mergedQuantity = target.getQuantite();
        for (LigneCommande duplicate : duplicates) {
            mergedQuantity += duplicate.getQuantite();
        }
        target.setQuantite(mergedQuantity);
        ligneRepo.deleteAll(duplicates);
    }
}
