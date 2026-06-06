package com.cm.restaurant_server.business.domain.dto.seccioncarta;

import java.util.List;

import com.cm.restaurant_server.business.domain.dto.detalleseccioncarta.DetalleSeccionCartaDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SeccionCartaCreateDto {
    private String nombre;
    private String categoriaNombre;
    private List<DetalleSeccionCartaDto> detallesSeccionCarta;
}
