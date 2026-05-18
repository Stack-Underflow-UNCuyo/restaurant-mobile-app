package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Factura;
import com.cm.restaurant_server.business.repository.FacturaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FacturaService extends BaseService<Factura> {
    @Autowired
    public FacturaService(FacturaRepository repository) {
        super(repository);
    }

    @Override
    protected void validar(Factura entity, CasoValidar caso) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'validar'");
    }
}
