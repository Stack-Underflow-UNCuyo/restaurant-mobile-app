package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.MovimientoStock;
import com.cm.restaurant_server.business.repository.MovimientoStockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class MovimientoStockService extends BaseService<MovimientoStock> {

    private final MovimientoStockRepository repository;

    @Autowired
    public MovimientoStockService(MovimientoStockRepository repository) {
        super(repository);
        this.repository = repository;
    }

    public List<MovimientoStock> findAllByArticulo(String articuloId) throws Exception {
        return repository.findAllByStockArticuloIdAndEliminadoFalse(articuloId);
    }

    @Override
    protected void validar(MovimientoStock entity, CasoValidar caso) throws Exception {
        if (entity.getStock() == null) {
            throw new Exception("El stock del movimiento es obligatorio");
        }

        if (entity.getTipoMovimientoStock() == null) {
            throw new Exception("El tipo de movimiento es obligatorio");
        }

        if (entity.getFechaMovimiento() == null || entity.getFechaMovimiento().isAfter(LocalDate.now())) {
            throw new Exception("La fecha del movimiento es obligatoria y no puede ser futura");
        }

        if (entity.getCantidad() <= 0) {
            throw new Exception("La cantidad del movimiento debe ser mayor a cero");
        }
    }
}
