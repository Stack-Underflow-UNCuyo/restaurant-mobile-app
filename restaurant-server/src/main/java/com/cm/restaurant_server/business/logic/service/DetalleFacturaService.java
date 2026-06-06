package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.DetalleFactura;
import com.cm.restaurant_server.business.repository.DetalleFacturaRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DetalleFacturaService extends BaseService<DetalleFactura> {
    @Autowired
    public DetalleFacturaService(DetalleFacturaRepository repository) {
        super(repository);
    }

    @Override
    protected void validar(DetalleFactura entity, CasoValidar caso) throws Exception {

    }

    public List<DetalleFactura> listarPorFactura(String facturaId) {
        return getRepository().findByFacturaIdAndEliminadoFalse(facturaId);
    }

    protected DetalleFacturaRepository getRepository() {
        return (DetalleFacturaRepository) this.baseRepository;
    }
}
