package org.example.projectecommerce.controller;

import jakarta.servlet.http.HttpSession;
import org.example.projectecommerce.dto.AddProductRequest;
import org.example.projectecommerce.entity.LigneCommande;
import org.example.projectecommerce.entity.Panier;
import org.example.projectecommerce.entity.Product;
import org.example.projectecommerce.repository.LigneCommandeRepository;
import org.example.projectecommerce.repository.PanierRepository;
import org.example.projectecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/paniers")
public class PanierController {

    private static final String SESSION_PANIER_ID = "panierId";

    @Autowired
    private PanierRepository panierRepository;

    @Autowired
    private LigneCommandeRepository ligneCommandeRepository;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping(value = "/addProduct", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @Transactional
    public Panier addProductForm(@RequestParam(required = false) Long panierId,
                                 @RequestParam Long productId,
                                 @RequestParam Integer qty,
                                 HttpSession session) {
        return addProductInternal(panierId, productId, qty, session);
    }

    @PostMapping(value = "/addProduct", consumes = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public Panier addProductJson(@RequestBody AddProductRequest request, HttpSession session) {
        if (request == null) {
            throw new IllegalArgumentException("La requete est vide");
        }
        return addProductInternal(request.getPanierId(), request.getProductId(), request.getQty(), session);
    }

    @PostMapping("/addProduct")
    @Transactional
    public Panier addProductFallback(@RequestParam(required = false) Long panierId,
                                     @RequestParam Long productId,
                                     @RequestParam Integer qty,
                                     HttpSession session) {
        return addProductInternal(panierId, productId, qty, session);
    }

    @GetMapping("/{panierId}")
    @Transactional(readOnly = true)
    public List<LigneCommande> getPanier(@PathVariable Long panierId) {
        if (!panierRepository.existsById(panierId)) {
            throw new RuntimeException("Panier introuvable");
        }
        return ligneCommandeRepository.findByPanierId(panierId);
    }

    @GetMapping("/current")
    @Transactional(readOnly = true)
    public List<LigneCommande> getCurrentPanier(HttpSession session) {
        Long panierId = (Long) session.getAttribute(SESSION_PANIER_ID);
        if (panierId == null) {
            return new ArrayList<>();
        }
        if (!panierRepository.existsById(panierId)) {
            return new ArrayList<>();
        }
        return ligneCommandeRepository.findByPanierId(panierId);
    }

    @DeleteMapping("/{panierId}/remove/{ligneId}")
    @Transactional
    public void removeProduct(@PathVariable Long panierId, @PathVariable Long ligneId) {
        LigneCommande ligne = ligneCommandeRepository.findById(ligneId)
                .orElseThrow(() -> new RuntimeException("Ligne introuvable"));

        if (ligne.getPanier() == null || !ligne.getPanier().getId().equals(panierId)) {
            throw new RuntimeException("Cette ligne n'appartient pas au panier");
        }

        ligneCommandeRepository.delete(ligne);
    }

    @DeleteMapping("/current/remove/{ligneId}")
    @Transactional
    public void removeCurrentProduct(@PathVariable Long ligneId, HttpSession session) {
        Long panierId = (Long) session.getAttribute(SESSION_PANIER_ID);
        if (panierId == null) {
            throw new RuntimeException("Panier introuvable");
        }
        removeProduct(panierId, ligneId);
    }

    private Panier addProductInternal(Long panierId, Long productId, Integer qty, HttpSession session) {
        if (productId == null || qty == null) {
            throw new IllegalArgumentException("productId et qty sont obligatoires");
        }
        if (qty <= 0) {
            throw new IllegalArgumentException("La quantite doit etre superieure a 0");
        }

        Panier panier = resolvePanier(panierId != null ? panierId : (Long) session.getAttribute(SESSION_PANIER_ID));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));

        List<LigneCommande> lignes = ligneCommandeRepository.findAllByPanierIdAndProductId(panier.getId(), productId);
        LigneCommande ligne;

        if (lignes.isEmpty()) {
            ligne = new LigneCommande();
            ligne.setPanier(panier);
            ligne.setProduct(product);
            ligne.setQuantite(0);
            panier.getLignes().add(ligne);
        } else {
            ligne = lignes.get(0);
            if (lignes.size() > 1) {
                int mergedQuantity = ligne.getQuantite();
                for (LigneCommande duplicate : lignes.subList(1, lignes.size())) {
                    mergedQuantity += duplicate.getQuantite();
                }
                ligne.setQuantite(mergedQuantity);
                ligneCommandeRepository.deleteAll(lignes.subList(1, lignes.size()));
            }
        }

        ligne.setQuantite(ligne.getQuantite() + qty);
        ligneCommandeRepository.save(ligne);

        Panier updatedPanier = panierRepository.findById(panier.getId())
                .orElseThrow(() -> new RuntimeException("Panier introuvable"));
        updatedPanier.setLignes(ligneCommandeRepository.findByPanierId(updatedPanier.getId()));
        session.setAttribute(SESSION_PANIER_ID, updatedPanier.getId());
        return updatedPanier;
    }

    private Panier resolvePanier(Long panierId) {
        if (panierId == null) {
            return panierRepository.save(new Panier());
        }
        return panierRepository.findById(panierId)
                .orElseGet(() -> panierRepository.save(new Panier()));
    }
}
