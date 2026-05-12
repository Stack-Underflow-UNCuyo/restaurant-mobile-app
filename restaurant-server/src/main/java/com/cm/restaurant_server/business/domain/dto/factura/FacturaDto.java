package com.cm.restaurant_server.business.domain.dto.factura;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.dto.empresa.EmpresaDto;
import com.cm.restaurant_server.business.domain.dto.formadepago.FormaDePagoDto;
import com.cm.restaurant_server.business.domain.dto.promocion.PromocionDto;
import com.cm.restaurant_server.business.domain.enumeration.EstadoFactura;
import lombok.*;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FacturaDto extends BaseDto {
    private Long numeroFactura;
    private LocalDate fechaFactura;
    private double totalPagado;
    private EstadoFactura estado;
    private FormaDePagoDto formaDePago;
    private PromocionDto promocion;
    private EmpresaDto empresa;
}
