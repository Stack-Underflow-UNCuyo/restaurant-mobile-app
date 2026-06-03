package com.cm.restaurant_server.business.domain.dto.resenia;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReseniaCreateDto {
    private String observacion;
    private String fechaResenia;
    private String comandaId;
}
