package com.cm.restaurant_server.business.domain.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Entity
@DiscriminatorValue("MENU")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetalleSeccionCartaMenu extends DetalleSeccionCarta {
    @ManyToOne
    private Menu menu;
}
