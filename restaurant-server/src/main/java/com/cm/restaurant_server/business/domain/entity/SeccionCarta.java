package com.cm.restaurant_server.business.domain.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SeccionCarta extends Base {
    @NotBlank(message = "Debe indicar el nombre")
    private String nombre;
    @ManyToOne
    private Categoria categoria;
    @OneToMany(mappedBy = "seccionCarta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleSeccionCarta> detallesSeccionCarta;
}
