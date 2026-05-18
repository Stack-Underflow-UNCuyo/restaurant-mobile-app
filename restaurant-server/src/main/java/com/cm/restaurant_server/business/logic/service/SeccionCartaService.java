package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.SeccionCarta;
import com.cm.restaurant_server.business.repository.SeccionCartaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SeccionCartaService extends BaseService<SeccionCarta> {
    @Autowired
    public SeccionCartaService(SeccionCartaRepository repository) {
        super(repository);
    }

    @Override
    protected void validar(SeccionCarta entity, CasoValidar caso) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'validar'");
    }
}
