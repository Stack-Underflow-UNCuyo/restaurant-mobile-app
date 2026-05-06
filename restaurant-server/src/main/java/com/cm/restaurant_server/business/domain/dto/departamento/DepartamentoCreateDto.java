package com.cm.restaurant_server.business.domain.dto.departamento;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DepartamentoCreateDto {
  @NotBlank(message = "Debe indicar el nombre")
  private String nombre;
  private String provinciaId;
}
