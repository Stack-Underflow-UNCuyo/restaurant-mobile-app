package com.cm.restaurant_server.business.domain.dto.resenia;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ReseniaDto extends BaseDto {
    private String observacion;
    private String fechaResenia;
}
