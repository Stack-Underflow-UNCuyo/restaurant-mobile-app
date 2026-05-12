package com.cm.restaurant_server.business.domain.entity;

import com.cm.restaurant_server.business.domain.enumeration.TipoEmpleado;
import jakarta.persistence.*;
import lombok.*;

@Entity
@DiscriminatorValue("EMPLEADO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Empleado extends Persona {
    @Enumerated(EnumType.STRING)
    private TipoEmpleado tipoEmpleado;
}
