package com.cm.restaurant_server.business.domain.dto.formadepago;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.enumeration.TipoPago;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FormaDePagoDto extends BaseDto {
    private TipoPago tipoPago;
    private String observacion;
}
