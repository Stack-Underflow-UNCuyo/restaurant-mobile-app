package com.cm.restaurant_server.business.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Direccion extends Base {
    @NotBlank
    (message = "Debe indicar la calle.")
    private String calle;
    @NotBlank
    @NotBlank
    @Digits(integer = 8, fraction = 0, message = "El campo debe contener hasta 8 dígitos enteros.")
    private String numeracion;
    @NotBlank
    @NotBlank(message = "Debe indicar el barrio.")
    private String barrio;
    @Column(length = 500)
    private String observacion;
    @ManyToOne
    private Localidad localidad;

}
