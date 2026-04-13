package org.example.projectecommerce.repository;
import java.util.List;
import org.example.projectecommerce.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByActiveTrue(); // Fetch only active categories
}
