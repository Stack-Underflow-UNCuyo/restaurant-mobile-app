package com.cm.restaurant_server.business.domain.entity;

import com.cm.restaurant_server.business.domain.enumeration.EstadoMesa;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MesaRestaurante extends Base {
    private int identificadorMesa;
    @Enumerated(EnumType.STRING)
    private EstadoMesa estadoMesa;
    private int capacidadPersonas;
    private String zonaFisica;
}
