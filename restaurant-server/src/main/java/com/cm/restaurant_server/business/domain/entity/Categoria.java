package com.cm.restaurant_server.business.domain.entity;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Categoria extends Base {
    @NotBlank(message = "Debe indicar el nombre")
    private String nombre;
}
