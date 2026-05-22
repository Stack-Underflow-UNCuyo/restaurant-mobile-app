package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.MovimientoStock;
import com.cm.restaurant_server.business.domain.entity.Stock;
import com.cm.restaurant_server.business.domain.enumeration.TipoMovimientoStock;
import com.cm.restaurant_server.business.repository.MovimientoStockRepository;
import com.cm.restaurant_server.business.repository.StockRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MovimientoStockService extends BaseService<MovimientoStock> {

    private final MovimientoStockRepository repository;
    private final StockRepository stockRepository;

    @Autowired
    public MovimientoStockService(MovimientoStockRepository repository, StockRepository stockRepository) {
        super(repository);
        this.repository = repository;
        this.stockRepository = stockRepository;
    }

    public List<MovimientoStock> findAllByArticulo(String articuloId) throws Exception {
        return repository.findAllByStockArticuloIdAndEliminadoFalse(articuloId);
    }

    @Override
    @Transactional
    public MovimientoStock save(@NonNull MovimientoStock entity) throws Exception {

        if (entity.getStock() == null || entity.getStock().getId() == null) {
            throw new Exception("Debe indicar el stock asociado al movimiento");
        }

        Stock stock = stockRepository.findById(entity.getStock().getId())
                .orElseThrow(() -> new Exception("Stock no encontrado para el movimiento"));

        // Increment stock counter
        if (entity.getTipoMovimientoStock() == TipoMovimientoStock.ENTRADA) {
            stock.setCantidadActual(stock.getCantidadActual() + entity.getCantidad());
        }
        // Decrement stock counter
        else if (entity.getTipoMovimientoStock() == TipoMovimientoStock.SALIDA) {
            if (stock.getCantidadActual() < entity.getCantidad()) {
                throw new Exception("No hay suficiente stock para realizar la salida");
            }
            stock.setCantidadActual(stock.getCantidadActual() - entity.getCantidad());
        } else {
            throw new Exception("Tipo de movimiento no válido");
        }

        // Sets fechaMovimiento on create
        entity.setFechaMovimiento(LocalDateTime.now());
        return super.save(entity);
    }

    @Override
    protected void validar(MovimientoStock entity, CasoValidar caso) throws Exception {
        if (entity.getStock() == null) {
            throw new Exception("El stock del movimiento es obligatorio");
        }

        if (entity.getTipoMovimientoStock() == null) {
            throw new Exception("El tipo de movimiento es obligatorio");
        }

        if (entity.getFechaMovimiento() == null || entity.getFechaMovimiento().isAfter(LocalDateTime.now())) {
            throw new Exception("La fecha del movimiento es obligatoria y no puede ser futura");
        }

        if (entity.getCantidad() <= 0) {
            throw new Exception("La cantidad del movimiento debe ser mayor a cero");
        }
    }
}
