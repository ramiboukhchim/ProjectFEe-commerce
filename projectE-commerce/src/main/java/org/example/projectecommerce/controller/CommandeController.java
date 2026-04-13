package org.example.projectecommerce.controller;

import org.example.projectecommerce.entity.Commande;
import org.example.projectecommerce.entity.LigneCommande;
import org.example.projectecommerce.entity.Panier;
import org.example.projectecommerce.repository.CommandeRepository;
import org.example.projectecommerce.repository.PanierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/commande")
public class CommandeController {

    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private PanierRepository panierRepository;

    @PostMapping("/from-panier/{panierId}")
    @Transactional
    public Commande createCommande(@PathVariable Long panierId) {
        Panier panier = panierRepository.findById(panierId)
                .orElseThrow(() -> new RuntimeException("Panier introuvable"));

        Commande commande = new Commande();
        for (LigneCommande ligne : panier.getLignes()) {
            ligne.setCommande(commande);
            ligne.setPanier(null);
            commande.getLignes().add(ligne);
        }

        panier.getLignes().clear();
        panierRepository.save(panier);

        return commandeRepository.save(commande);
    }
}
