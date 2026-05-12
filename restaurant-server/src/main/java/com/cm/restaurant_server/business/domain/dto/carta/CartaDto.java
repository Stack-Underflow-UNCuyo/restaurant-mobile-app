package com.cm.restaurant_server.business.domain.dto.carta;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import lombok.*;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CartaDto extends BaseDto {
    private LocalDate fechaDesde;
    private LocalDate fechaHasta;
}
