package com.cm.restaurant_server.business.domain.dto.carta;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

import com.cm.restaurant_server.business.domain.dto.detalleseccioncarta.DetalleSeccionCartaDto;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartaCreateDto {
    private LocalDate fechaDesde;
    private LocalDate fechaHasta;
}
