package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.DetalleFactura;
import com.cm.restaurant_server.business.repository.DetalleFacturaRepository;
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
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'validar'");
    }
}
