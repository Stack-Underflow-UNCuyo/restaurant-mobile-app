package com.cm.restaurant_server.business.domain.dto.mercadopago;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.entity.Sucursal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Respuesta con los datos de una sucursal persistida. */
@NoArgsConstructor
@Getter
@Setter
public class SucursalDto extends BaseDto {
    private Long mpStoreId;
    private String nombre;
    private String externalId;
    private String addressLine;
    private Double latitude;
    private Double longitude;
    private String referencia;

    public static SucursalDto from(Sucursal s) {
        SucursalDto dto = new SucursalDto();
        dto.setId(s.getId());
        dto.setMpStoreId(s.getMpStoreId());
        dto.setNombre(s.getNombre());
        dto.setExternalId(s.getExternalId());
        dto.setAddressLine(s.getAddressLine());
        dto.setLatitude(s.getLatitude());
        dto.setLongitude(s.getLongitude());
        dto.setReferencia(s.getReferencia());
        return dto;
    }
}
