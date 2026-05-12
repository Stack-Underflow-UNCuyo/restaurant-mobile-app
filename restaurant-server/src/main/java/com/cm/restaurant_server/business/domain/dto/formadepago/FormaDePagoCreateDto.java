package com.cm.restaurant_server.business.domain.dto.formadepago;

import com.cm.restaurant_server.business.domain.enumeration.TipoPago;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FormaDePagoCreateDto {
    private TipoPago tipoPago;
    private String observacion;
}
