package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.Sucursal;

import java.util.Optional;

import org.springframework.stereotype.Repository;

@Repository
public interface SucursalRepository extends BaseRepository<Sucursal> {
    Optional<Sucursal> findByExternalIdAndEliminadoFalse(String externalId);
}
