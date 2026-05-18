package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.Articulo;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ArticuloRepository extends BaseRepository<Articulo> {
    Optional<Articulo> findByNombreAndEliminadoFalse(String nombre);
}
