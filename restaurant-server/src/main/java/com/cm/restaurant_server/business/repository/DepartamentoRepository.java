package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.Departamento;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartamentoRepository extends BaseRepository<Departamento> {
    Optional<Departamento> findByNombreAndEliminadoFalse(String nombre);
    boolean existsByNombreAndEliminadoFalse(String nombre);
}