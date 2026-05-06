package com.cm.restaurant_server.business.domain.dto.localidad;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.dto.departamento.DepartamentoDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class LocalidadDto extends BaseDto {
  private String nombre;
  private String codigoPostal;
  private String departamentoId;
  private DepartamentoDto departamento;
}
