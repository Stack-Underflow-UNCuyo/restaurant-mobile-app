package com.cm.restaurant_server.business.domain.dto.factura;

import com.cm.restaurant_server.business.domain.enumeration.EstadoFactura;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FacturaCreateDto {
    private Long numeroFactura;
    private LocalDate fechaFactura;
    private double totalPagado;
    private EstadoFactura estado;
    private String formaDePagoId;
    private String promocionId;
    private String empresaId;
    private List<String> detalleFacturaIds;
}
