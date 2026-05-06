package com.cm.restaurant_server.business.domain.dto.direccion;

import com.cm.restaurant_server.business.domain.dto.BaseDto;

import com.cm.restaurant_server.business.domain.dto.localidad.LocalidadDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DireccionDto extends BaseDto {
  private String calle;
  private String numeracion;
  private String barrio;
  private String observacion;
  private String localidadId;
  private LocalidadDto localidad;
}
