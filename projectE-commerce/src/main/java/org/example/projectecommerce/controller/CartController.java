package org.example.projectecommerce.controller;

import org.example.projectecommerce.entity.Product;
import org.example.projectecommerce.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/client/cart")
public class CartController {

    private List<Product> cart = new ArrayList<>();

    @GetMapping
    @PreAuthorize("hasRole('CLIENT')")
    public List<Product> viewCart() {
        return cart;
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<String> addToCart(@RequestBody Product product) {
        cart.add(product);
        return ResponseEntity.ok("Product added to cart");
    }

    @DeleteMapping("/remove/{productId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<String> removeFromCart(@PathVariable Long productId) {
        cart.removeIf(product -> product.getId().equals(productId));
        return ResponseEntity.ok("Product removed from cart");
    }
}