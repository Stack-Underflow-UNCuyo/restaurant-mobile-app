package com.cm.restaurant_server.business.domain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Empresa extends Base {
    @NotBlank(message = "Debe indicar el nombre")
    private String nombre;
    @ManyToOne
    private Direccion direccion;
    @OneToMany(cascade = CascadeType.ALL) //si el contacto es nuevo, lo crea, lo guarda, lo asigna a empresa y luego guarda empresa
    @JoinColumn(name = "empresa_id")
    private List<Contacto> contactos = new ArrayList<>();

}
