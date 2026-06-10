package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.FormaDePago;
import com.cm.restaurant_server.business.domain.enumeration.TipoPago;

import java.util.Optional;

import org.springframework.stereotype.Repository;

@Repository
public interface FormaDePagoRepository extends BaseRepository<FormaDePago> {
    Optional<FormaDePago> findByTipoPagoAndEliminadoFalse(TipoPago tipoPago);
}
