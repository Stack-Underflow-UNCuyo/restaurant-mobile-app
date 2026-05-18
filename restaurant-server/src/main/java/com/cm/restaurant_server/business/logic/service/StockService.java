package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Stock;
import com.cm.restaurant_server.business.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockService extends BaseService<Stock> {

    private final StockRepository repository;

    @Autowired
    public StockService(StockRepository repository) {
        super(repository);
        this.repository = repository;
    }

    public List<Stock> findAllByArticulo(String articuloId) throws Exception {
        return repository.findAllByArticuloIdAndEliminadoFalse(articuloId);
    }

@Override
    protected void validar(Stock entity, CasoValidar caso) throws Exception {
        if (entity.getArticulo() == null) {
            throw new Exception("El artículo del stock es obligatorio");
        }

        if (entity.getMinimo() < 0) {
            throw new Exception("El mínimo del stock no puede ser negativo");
        }

        if (entity.getCantidadActual() < 0) {
            throw new Exception("La cantidad actual del stock no puede ser negativa");
        }
    }
}
