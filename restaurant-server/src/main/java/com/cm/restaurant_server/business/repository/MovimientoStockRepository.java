package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.MovimientoStock;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimientoStockRepository extends BaseRepository<MovimientoStock> {
    List<MovimientoStock> findAllByStockArticuloIdAndEliminadoFalse(String articuloId);
}
