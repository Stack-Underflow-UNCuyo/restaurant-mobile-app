package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.Categoria;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoriaRepository extends BaseRepository<Categoria> {
    Optional<Categoria> findByNombreAndEliminadoFalse(String nombre);
}
