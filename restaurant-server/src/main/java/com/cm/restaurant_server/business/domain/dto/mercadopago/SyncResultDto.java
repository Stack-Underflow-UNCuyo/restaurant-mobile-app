package com.cm.restaurant_server.business.domain.dto.mercadopago;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Resultado de sincronizar sucursales y cajas desde Mercado Pago. */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SyncResultDto {
    private List<SucursalDto> sucursales;
    private List<CajaDto> cajas;
}
