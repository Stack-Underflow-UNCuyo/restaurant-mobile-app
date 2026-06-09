package com.cm.restaurant_server.business.domain.dto.resenia;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReseniaCreateDto {
    private String observacion;
    private String fechaResenia;
    private String comandaId;
    private Integer ambiente;
    private Integer servicio;
    private Integer comida;
}
