package com.cm.restaurant_server.business.domain.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@DiscriminatorValue("CLIENTE")
@Getter
@Setter
@NoArgsConstructor
public class Cliente extends Persona {
}
