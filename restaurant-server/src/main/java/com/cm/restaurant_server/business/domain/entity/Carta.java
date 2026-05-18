package com.cm.restaurant_server.business.domain.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Carta extends Base {
    private LocalDate fechaDesde;
    private LocalDate fechaHasta;
    @ManyToOne
    private SeccionCarta seccionCarta;
}
