package com.cm.restaurant_server.business.domain.dto.carta;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartaCreateDto {
    private List<String> seccionCartaIds;
    private LocalDate fechaDesde;
    private LocalDate fechaHasta;
}
