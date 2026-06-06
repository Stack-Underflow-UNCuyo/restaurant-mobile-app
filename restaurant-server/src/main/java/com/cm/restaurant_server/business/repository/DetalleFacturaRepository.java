package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.DetalleFactura;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleFacturaRepository extends BaseRepository<DetalleFactura> {
    List<DetalleFactura> findByFacturaIdAndEliminadoFalse(String facturaId);
}
