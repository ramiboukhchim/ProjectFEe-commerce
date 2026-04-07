package org.example.projectecommerce.dto;

import lombok.Data;

@Data
public class AddProductRequest {
    private Long panierId;
    private Long productId;
    private Integer qty;
}
