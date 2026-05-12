package com.cm.restaurant_server.business.domain.dto.detalleseccioncarta;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetalleSeccionCartaMenuCreateDto extends DetalleSeccionCartaCreateDto {
    private String menuId;
}
