package com.cm.restaurant_server.business.domain.dto.detalleseccioncarta;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.dto.seccioncarta.SeccionCartaDto;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DetalleSeccionCartaDto extends BaseDto {
    private SeccionCartaDto seccionCarta;
}
