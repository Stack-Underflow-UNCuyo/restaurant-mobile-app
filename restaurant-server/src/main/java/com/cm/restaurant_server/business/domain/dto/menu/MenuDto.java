package com.cm.restaurant_server.business.domain.dto.menu;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MenuDto extends BaseDto {
    private double precio;
}
