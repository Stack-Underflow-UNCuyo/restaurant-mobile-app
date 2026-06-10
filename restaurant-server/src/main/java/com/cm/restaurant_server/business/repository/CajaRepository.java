package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.Caja;

import java.util.Optional;

import org.springframework.stereotype.Repository;

@Repository
public interface CajaRepository extends BaseRepository<Caja> {
    Optional<Caja> findByExternalIdAndEliminadoFalse(String externalId);
}
