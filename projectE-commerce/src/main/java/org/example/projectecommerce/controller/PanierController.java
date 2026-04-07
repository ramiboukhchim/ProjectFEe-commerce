package org.example.projectecommerce.controller;

import jakarta.servlet.http.HttpSession;
import org.example.projectecommerce.dto.AddProductRequest;
import org.example.projectecommerce.entity.LigneCommande;
import org.example.projectecommerce.entity.Panier;
import org.example.projectecommerce.service.PanierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
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
    private PanierService panierService;

    @PostMapping(value = "/addProduct", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public Panier addProductForm(@RequestParam(required = false) Long panierId,
                                 @RequestParam Long productId,
                                 @RequestParam Integer qty,
                                 HttpSession session) {
        return addProductInternal(panierId, productId, qty, session);
    }

    @PostMapping(value = "/addProduct", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Panier addProductJson(@RequestBody AddProductRequest request, HttpSession session) {
        if (request == null) {
            throw new IllegalArgumentException("La requete est vide");
        }
        return addProductInternal(request.getPanierId(), request.getProductId(), request.getQty(), session);
    }

    @PostMapping("/addProduct")
    public Panier addProductFallback(@RequestParam(required = false) Long panierId,
                                     @RequestParam Long productId,
                                     @RequestParam Integer qty,
                                     HttpSession session) {
        return addProductInternal(panierId, productId, qty, session);
    }

    @GetMapping("/{panierId}")
    public List<LigneCommande> getPanier(@PathVariable Long panierId) {
        return panierService.getPanier(panierId);
    }

    @GetMapping("/current")
    public List<LigneCommande> getCurrentPanier(HttpSession session) {
        Long panierId = (Long) session.getAttribute(SESSION_PANIER_ID);
        if (panierId == null) {
            return new ArrayList<>();
        }
        return panierService.getPanier(panierId);
    }

    @DeleteMapping("/{panierId}/remove/{ligneId}")
    public void removeProduct(@PathVariable Long panierId, @PathVariable Long ligneId) {
        panierService.removeProduct(panierId, ligneId);
    }

    @DeleteMapping("/current/remove/{ligneId}")
    public void removeCurrentProduct(@PathVariable Long ligneId, HttpSession session) {
        Long panierId = (Long) session.getAttribute(SESSION_PANIER_ID);
        if (panierId == null) {
            throw new RuntimeException("Panier introuvable");
        }
        panierService.removeProduct(panierId, ligneId);
    }

    private Panier addProductInternal(Long panierId, Long productId, Integer qty, HttpSession session) {
        if (productId == null || qty == null) {
            throw new IllegalArgumentException("productId et qty sont obligatoires");
        }

        Long effectivePanierId = panierId != null ? panierId : (Long) session.getAttribute(SESSION_PANIER_ID);
        Panier panier = panierService.addProduct(effectivePanierId, productId, qty);
        session.setAttribute(SESSION_PANIER_ID, panier.getId());
        return panier;
    }
}
