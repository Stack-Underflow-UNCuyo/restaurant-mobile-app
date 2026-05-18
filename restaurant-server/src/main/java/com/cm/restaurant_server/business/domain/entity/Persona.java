package com.cm.restaurant_server.business.domain.entity;

import com.cm.restaurant_server.business.domain.enumeration.TipoDocumento;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "tipo_persona")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Persona extends Base {
    private String nombre;
    private String apellido;
    private LocalDate fechaNacimiento;
    @Enumerated(EnumType.STRING)
    private TipoDocumento tipoDocumento;
    private String numeroDocumento;
    @ManyToOne
    private Direccion direccion;
    @ManyToOne
    private Usuario usuario;
    @OneToMany(mappedBy = "persona")
    private List<Contacto> contactos = new ArrayList<>();
}
