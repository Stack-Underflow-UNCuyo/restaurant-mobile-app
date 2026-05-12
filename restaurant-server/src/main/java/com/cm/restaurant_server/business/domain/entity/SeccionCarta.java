package com.cm.restaurant_server.business.domain.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SeccionCarta extends Base {
    @ManyToOne
    private Categoria categoria;
    @ManyToOne
    private Carta carta;
}
