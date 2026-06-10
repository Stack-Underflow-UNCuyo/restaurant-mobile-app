package com.cm.restaurant_server.business.domain.dto.mercadopago;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.entity.Caja;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Respuesta con los datos de una caja persistida (incluye el QR de cobro). */
@NoArgsConstructor
@Getter
@Setter
public class CajaDto extends BaseDto {
    private Long mpPosId;
    private String nombre;
    private String externalId;
    private String externalStoreId;
    private Long category;
    private Boolean fixedAmount;
    private String status;
    private String uuid;
    private String qrImage;
    private String qrTemplateDocument;
    private String qrTemplateImage;
    private String sucursalId;

    public static CajaDto from(Caja c) {
        CajaDto dto = new CajaDto();
        dto.setId(c.getId());
        dto.setMpPosId(c.getMpPosId());
        dto.setNombre(c.getNombre());
        dto.setExternalId(c.getExternalId());
        dto.setExternalStoreId(c.getExternalStoreId());
        dto.setCategory(c.getCategory());
        dto.setFixedAmount(c.getFixedAmount());
        dto.setStatus(c.getStatus());
        dto.setUuid(c.getUuid());
        dto.setQrImage(c.getQrImage());
        dto.setQrTemplateDocument(c.getQrTemplateDocument());
        dto.setQrTemplateImage(c.getQrTemplateImage());
        dto.setSucursalId(c.getSucursal() != null ? c.getSucursal().getId() : null);
        return dto;
    }
}
