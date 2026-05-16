package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.Empresa;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmpresaRepository extends BaseRepository<Empresa> {
    Optional<Empresa> findByNombreAndEliminadoFalse(String nombre);
    boolean existsByNombreAndEliminadoFalse(String nombre);
}
