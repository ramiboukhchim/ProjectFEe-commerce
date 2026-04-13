package org.example.projectecommerce.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        // Ne pas intercepter les exceptions de sécurité Spring
        if (ex instanceof AccessDeniedException) {
            throw (AccessDeniedException) ex;
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        String message = "Operation impossible: cette ressource est encore utilisee par d'autres donnees.";
        String rootMessage = ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : "";

        if (rootMessage.contains("REFERENCES `product`")) {
            message = "Suppression impossible: ce produit est utilise dans des lignes de commande ou de panier.";
        } else if (rootMessage.contains("REFERENCES `category`")) {
            message = "Suppression impossible: cette categorie est encore utilisee par des produits.";
        } else if (rootMessage.contains("REFERENCES `supplier`")) {
            message = "Suppression impossible: ce fournisseur est encore utilise par des produits.";
        }

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", message));
    }
}
