package com.cm.restaurant_server.business.domain.dto.detalleseccioncarta;

import com.cm.restaurant_server.business.domain.dto.menu.MenuDto;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DetalleSeccionCartaMenuDto extends DetalleSeccionCartaDto {
    private MenuDto menu;
}
