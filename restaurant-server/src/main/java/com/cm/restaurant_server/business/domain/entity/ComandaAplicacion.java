package com.cm.restaurant_server.business.domain.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;

@Entity
@DiscriminatorValue("APLICACION")
@Getter
@Setter
@NoArgsConstructor
public class ComandaAplicacion extends Comanda {
}
