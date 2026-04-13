package org.example.projectecommerce.repository;

import org.example.projectecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByActiveTrue(); // Fetch only active products
}
