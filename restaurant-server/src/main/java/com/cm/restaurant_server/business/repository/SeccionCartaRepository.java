package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.SeccionCarta;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeccionCartaRepository extends BaseRepository<SeccionCarta> {
    Optional<SeccionCarta> findByCategoriaIdAndEliminadoFalse(String categoriaId);
    List<SeccionCarta> findAllByCategoriaIdAndEliminadoFalse(String categoriaId);
}
