package com.cm.restaurant_server.business.domain.dto.seccioncarta;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SeccionCartaCreateDto {
    private String nombre;
    private String categoriaId;
}
