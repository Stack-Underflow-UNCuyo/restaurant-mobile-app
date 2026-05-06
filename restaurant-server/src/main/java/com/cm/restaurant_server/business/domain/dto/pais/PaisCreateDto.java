package com.cm.restaurant_server.business.domain.dto.pais;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotEmpty;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaisCreateDto {
    @NotBlank(message = "Debe indicar el nombre")
    private String nombre;
}