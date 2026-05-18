package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Comanda;
import com.cm.restaurant_server.business.repository.ComandaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ComandaService extends BaseService<Comanda> {
    @Autowired
    public ComandaService(ComandaRepository repository) {
        super(repository);
    }

    @Override
    protected void validar(Comanda entity, CasoValidar caso) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'validar'");
    }
}
