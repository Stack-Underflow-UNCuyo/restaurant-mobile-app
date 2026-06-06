package com.cm.restaurant_server.business.domain.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Carta extends Base {
    private LocalDate fechaDesde;
    private LocalDate fechaHasta;
    @ManyToMany
    @JoinTable(
        name = "carta_seccion_carta",
        joinColumns = @JoinColumn(name = "carta_id"),
        inverseJoinColumns = @JoinColumn(name = "seccion_carta_id")
    )
    private List<SeccionCarta> seccionesCarta = new ArrayList<>();
}
