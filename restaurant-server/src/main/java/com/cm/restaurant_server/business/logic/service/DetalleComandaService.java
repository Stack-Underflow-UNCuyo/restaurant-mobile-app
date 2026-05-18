package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.DetalleComanda;
import com.cm.restaurant_server.business.repository.DetalleComandaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DetalleComandaService extends BaseService<DetalleComanda> {
    @Autowired
    public DetalleComandaService(DetalleComandaRepository repository) {
        super(repository);
    }

    @Override
    protected void validar(DetalleComanda entity, CasoValidar caso) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'validar'");
    }
}
