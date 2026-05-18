package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.Stock;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockRepository extends BaseRepository<Stock> {
    List<Stock> findAllByArticuloIdAndEliminadoFalse(String articuloId);
}
