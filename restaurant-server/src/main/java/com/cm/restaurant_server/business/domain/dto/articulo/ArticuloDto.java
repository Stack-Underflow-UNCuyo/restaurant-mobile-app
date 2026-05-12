package com.cm.restaurant_server.business.domain.dto.articulo;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.dto.unidaddemedida.UnidadDeMedidaDto;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ArticuloDto extends BaseDto {
    private String nombre;
    private String descripcion;
    private boolean sinTAC;
    private boolean esIngrediente;
    private UnidadDeMedidaDto unidadDeMedida;
}
