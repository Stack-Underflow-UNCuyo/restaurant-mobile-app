package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.Provincia;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProvinciaRepository extends BaseRepository<Provincia> {
    Optional<Provincia> findByNombreAndEliminadoFalse(String nombre);
    boolean existsByNombreAndEliminadoFalse(String nombre);
}