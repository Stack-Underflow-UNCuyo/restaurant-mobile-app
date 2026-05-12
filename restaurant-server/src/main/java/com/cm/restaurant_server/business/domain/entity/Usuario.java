package com.cm.restaurant_server.business.domain.entity;

import com.cm.restaurant_server.business.domain.enumeration.Rol;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario extends Base {
    @Email(message = "Debe respetar formato")
    private String email;
    @NotEmpty(message = "El campo no puede ser vacio.")
    @Column(nullable = false, length = 255)
    private String clave;
    @Enumerated(EnumType.STRING)
    private Rol rol;
    @ManyToOne
    private Imagen imagen;
}
