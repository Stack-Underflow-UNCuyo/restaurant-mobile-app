package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.Localidad;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocalidadRepository extends BaseRepository<Localidad> {
    Optional<Localidad> findByNombreAndEliminadoFalse(String nombre);
    boolean existsByNombreAndEliminadoFalse(String nombre);
    Optional<Localidad> findByCodigoPostalAndEliminadoFalse(String codigoPostal);
    boolean existsByCodigoPostalAndEliminadoFalse(String codigoPostal);
}
