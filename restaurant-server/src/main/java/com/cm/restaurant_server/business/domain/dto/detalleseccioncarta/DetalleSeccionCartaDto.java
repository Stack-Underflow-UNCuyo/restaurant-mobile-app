package com.cm.restaurant_server.business.domain.dto.detalleseccioncarta;

import com.cm.restaurant_server.business.domain.dto.BaseDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DetalleSeccionCartaDto extends BaseDto {
    private String seccionCartaId;
}
