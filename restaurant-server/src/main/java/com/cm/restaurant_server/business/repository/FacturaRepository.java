package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.Factura;
import com.cm.restaurant_server.business.domain.enumeration.EstadoFactura;

import java.util.List;

import org.springframework.stereotype.Repository;

@Repository
public interface FacturaRepository extends BaseRepository<Factura> {
    List<Factura> findByEstadoFactura(EstadoFactura estadoFactura);
}
