package com.cm.restaurant_server.business.domain.dto.provincia;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProvinciaCreateDto {
  @NotBlank(message = "Debe indicar un nombre.")
  private String nombre;
  private String paisId;
}
