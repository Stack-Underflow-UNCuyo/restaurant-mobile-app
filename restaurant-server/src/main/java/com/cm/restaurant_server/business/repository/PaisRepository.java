package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.Pais;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaisRepository extends BaseRepository<Pais> {
    Optional<Pais> findByNombreAndEliminadoFalse(String nombre);
    boolean existsByNombreAndEliminadoFalse(String nombre);
}