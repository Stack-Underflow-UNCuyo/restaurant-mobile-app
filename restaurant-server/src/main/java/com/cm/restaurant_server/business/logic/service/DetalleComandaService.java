package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.*;
import com.cm.restaurant_server.business.domain.enumeration.EstadoDetalleComanda;
import com.cm.restaurant_server.business.domain.enumeration.TipoMovimientoStock;
import com.cm.restaurant_server.business.repository.DetalleComandaRepository;
import com.cm.restaurant_server.business.repository.StockRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DetalleComandaService extends BaseService<DetalleComanda> {

    private final MovimientoStockService movimientoStockService;
    private final StockRepository stockRepository;

    public DetalleComandaService(DetalleComandaRepository repository,
                                 MovimientoStockService movimientoStockService,
                                 StockRepository stockRepository) {
        super(repository);
        this.movimientoStockService = movimientoStockService;
        this.stockRepository = stockRepository;
    }

    @Override
    @Transactional
    public DetalleComanda update(String id, DetalleComanda entity) throws Exception {
        EstadoDetalleComanda estadoAnterior = findById(id).getEstadoDetalleComanda();
        DetalleComanda actualizada = super.update(id, entity);
        if (estadoAnterior != EstadoDetalleComanda.COCINERO_ASIGNADO
                && actualizada.getEstadoDetalleComanda() == EstadoDetalleComanda.COCINERO_ASIGNADO) {
            descontarStock(actualizada);
        }
        return actualizada;
    }

    @Override
    protected void validar(DetalleComanda entity, CasoValidar caso) throws Exception {
    }

    private void descontarStock(DetalleComanda dc) throws Exception {
        DetalleSeccionCarta dsc = dc.getDetalleSeccionCarta();
        if (dsc instanceof DetalleSeccionCartaArticuloIndividual ai) {
            descontarArticulo(ai.getArticulo(), dc.getCantidad());
        } else if (dsc instanceof DetalleSeccionCartaMenu dm) {
            for (DetalleMenu detalleMenu : dm.getMenu().getDetallesMenu()) {
                if (detalleMenu.getArticulo() != null) {
                    descontarArticulo(detalleMenu.getArticulo(), detalleMenu.getArticuloCantidad() * dc.getCantidad());
                }
            }
        }
    }

    private void descontarArticulo(Articulo articulo, double cantidad) throws Exception {
        List<Stock> stocks = stockRepository.findAllByArticuloIdAndEliminadoFalse(articulo.getId());
        if (stocks.isEmpty()) return;
        MovimientoStock mov = new MovimientoStock();
        mov.setStock(stocks.get(0));
        mov.setCantidad(cantidad);
        mov.setTipoMovimientoStock(TipoMovimientoStock.SALIDA);
        movimientoStockService.save(mov);
    }
}
