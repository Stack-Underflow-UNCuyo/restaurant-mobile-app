package com.cm.restaurant_server.business.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Resenia extends Base {
    private String observacion;
    private String fechaResenia;
    @ManyToOne
    @JoinColumn(name = "comanda_id")
    private Comanda comanda;
}
