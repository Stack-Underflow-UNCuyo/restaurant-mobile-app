package com.cm.restaurant_server.business.domain.dto.mercadopago;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Estado de una order consultado en Mercado Pago (para el polling de pago). */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class EstadoOrdenDto {
    private String status;
    private boolean paid;
}
