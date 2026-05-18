package com.cm.restaurant_server.business.domain.dto.seccioncarta;

import java.util.List;

import com.cm.restaurant_server.business.domain.dto.detalleseccioncarta.DetalleSeccionCartaDto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SeccionCartaCreateDto {
    private String nombre;
    private String categoriaId;
    private String cartaId;
    private List<DetalleSeccionCartaDto> detallesSeccionCarta;
}
