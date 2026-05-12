package com.cm.restaurant_server.business.domain.dto.carta;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartaCreateDto {
    private LocalDate fechaDesde;
    private LocalDate fechaHasta;
}
