package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.UnidadDeMedida;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UnidadDeMedidaRepository extends BaseRepository<UnidadDeMedida> {
    Optional<UnidadDeMedida> findByNombreAndEliminadoFalse(String nombre);
}
