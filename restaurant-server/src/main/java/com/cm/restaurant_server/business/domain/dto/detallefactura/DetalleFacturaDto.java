package com.cm.restaurant_server.business.domain.dto.detallefactura;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.dto.detallecomanda.DetalleComandaDto;
import com.cm.restaurant_server.business.domain.dto.factura.FacturaDto;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DetalleFacturaDto extends BaseDto {
    private int cantidad;
    private double subtotal;
    private FacturaDto factura;
    private DetalleComandaDto detalleComanda;
}
