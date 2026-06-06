package com.cm.restaurant_server.business.domain.dto.carta;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.dto.seccioncarta.SeccionCartaDto;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CartaDto extends BaseDto {
    private List<SeccionCartaDto> seccionesCarta;
    private LocalDate fechaDesde;
    private LocalDate fechaHasta;
}
