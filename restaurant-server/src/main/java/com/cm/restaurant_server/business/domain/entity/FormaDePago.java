package com.cm.restaurant_server.business.domain.entity;

import com.cm.restaurant_server.business.domain.enumeration.TipoPago;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FormaDePago extends Base {
    @Enumerated(EnumType.STRING)
    private TipoPago tipoPago;
    private String observacion;
}
