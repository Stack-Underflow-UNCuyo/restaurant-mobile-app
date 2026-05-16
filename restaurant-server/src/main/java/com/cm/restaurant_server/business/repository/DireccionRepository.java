package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.Direccion;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DireccionRepository extends BaseRepository<Direccion> {
    Optional<Direccion> findByCalleAndNumeracionAndEliminadoFalse(String calle, String numeracion);
    Optional<Direccion> findByCalleAndNumeracionAndBarrioAndLocalidad_IdAndEliminadoFalse(String calle, String numeracion, String barrio, String idLocalidad);
    boolean existsByCalleAndNumeracionAndBarrioAndLocalidad_IdAndEliminadoFalse(String calle, String numeracion, String barrio, String idLocalidad);
}