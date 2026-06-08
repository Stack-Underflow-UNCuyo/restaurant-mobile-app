package com.cm.restaurant_server.business.domain.dto.factura;

import com.cm.restaurant_server.business.domain.enumeration.EstadoFactura;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GenerarFacturaDto {
    private String comandaId;
    private String formaDePagoId;
    private String promocionId; // opcional
    private LocalDate fechaFactura;
    private EstadoFactura estado;
}
