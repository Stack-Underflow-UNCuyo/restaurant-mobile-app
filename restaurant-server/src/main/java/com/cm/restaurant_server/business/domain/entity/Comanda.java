package com.cm.restaurant_server.business.domain.entity;

import com.cm.restaurant_server.business.domain.enumeration.EstadoComanda;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.SQLRestriction;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "tipo_comanda")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Comanda extends Base {
    private LocalDateTime fechaSolicitudComanda;
    private LocalDateTime fechaEntregaComanda;
    @Enumerated(EnumType.STRING)
    private EstadoComanda estadoComanda;
    @ManyToOne
    private Cliente cliente;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "comanda", orphanRemoval = true)
    @SQLRestriction("eliminado = false")
    private List<DetalleComanda> detalleComandas = new ArrayList<>();
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "comanda", orphanRemoval = true)
    @SQLRestriction("eliminado = false")
    private List<Resenia> resenias = new ArrayList<>();
}
