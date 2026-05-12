package com.cm.restaurant_server.business.domain.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Empresa extends Base {
    @NotBlank(message = "Debe indicar el nombre")
    private String nombre;
    private String telefono;
    private String correoElectronico;
    @ManyToOne
    private Direccion direccion;
    @ManyToOne
    private Contacto contacto;
}
