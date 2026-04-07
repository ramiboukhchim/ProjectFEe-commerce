package org.example.projectecommerce.service;

import org.example.projectecommerce.entity.*;
import org.example.projectecommerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CommandeService {

    @Autowired
    private CommandeRepository commandeRepo;

    @Autowired
    private PanierRepository panierRepo;

    public Commande createCommandeFromPanier(Long panierId) {
        Panier panier = panierRepo.findById(panierId).orElseThrow();
        Commande commande = new Commande();

        for (LigneCommande ligne : panier.getLignes()) {
            ligne.setCommande(commande);
            ligne.setPanier(null);
            commande.getLignes().add(ligne);
        }

        panier.getLignes().clear();
        panierRepo.save(panier);

        return commandeRepo.save(commande);
    }
}