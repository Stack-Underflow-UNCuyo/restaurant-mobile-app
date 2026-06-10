package com.cm.restaurant_server.business.domain.dto.mercadopago;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.entity.Orden;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Respuesta con los datos de una order persistida (incluye qrData a renderizar). */
@NoArgsConstructor
@Getter
@Setter
public class OrdenDto extends BaseDto {
    private String orderId;
    private String paymentId;
    private String status;
    private String statusDetail;
    private Double amount;
    private String externalReference;
    private String mode;
    private String qrData;
    private String comandaId;
    private String cajaExternalId;

    public static OrdenDto from(Orden o) {
        OrdenDto dto = new OrdenDto();
        dto.setId(o.getId());
        dto.setOrderId(o.getOrderId());
        dto.setPaymentId(o.getPaymentId());
        dto.setStatus(o.getStatus());
        dto.setStatusDetail(o.getStatusDetail());
        dto.setAmount(o.getAmount());
        dto.setExternalReference(o.getExternalReference());
        dto.setMode(o.getMode());
        dto.setQrData(o.getQrData());
        dto.setComandaId(o.getComandaId());
        dto.setCajaExternalId(o.getCaja() != null ? o.getCaja().getExternalId() : null);
        return dto;
    }
}
