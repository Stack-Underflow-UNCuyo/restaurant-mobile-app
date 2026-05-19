package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Comanda;
import com.cm.restaurant_server.business.domain.entity.DetalleComanda;
import com.cm.restaurant_server.business.repository.ComandaRepository;
import jakarta.transaction.Transactional;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class ComandaService extends BaseService<Comanda> {
    public ComandaService(ComandaRepository repository, DetalleComandaService detalleComandaService) {
        super(repository);
    }

    @Override
    protected void validar(Comanda entity, CasoValidar caso) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'validar'");
    }

    @Transactional
    public List<DetalleComanda> agregarDetalleComanda(DetalleComanda detalle) throws Exception {
        var comanda = this.findById(detalle.getComanda().getId());
        comanda.getDetalleComandas().add(detalle);
        this.baseRepository.save(comanda);
        return comanda.getDetalleComandas();
    }

    @Transactional
    public List<DetalleComanda> listarDetalleComanda(String idComanda) throws Exception {
        return this.findById(idComanda).getDetalleComandas();
    }
}
