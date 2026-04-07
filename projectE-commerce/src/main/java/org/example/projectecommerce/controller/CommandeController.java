package org.example.projectecommerce.controller;

import org.example.projectecommerce.entity.Commande;
import org.example.projectecommerce.service.CommandeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/commande")
public class CommandeController {

    @Autowired
    private CommandeService commandeService;

    @PostMapping("/from-panier/{panierId}")
    public Commande createCommande(@PathVariable Long panierId) {
        return commandeService.createCommandeFromPanier(panierId);
    }
}
