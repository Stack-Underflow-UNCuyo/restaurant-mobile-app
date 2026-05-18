package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.ComandaAplicacion;
import com.cm.restaurant_server.business.repository.ComandaAplicacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ComandaAplicacionService extends BaseService<ComandaAplicacion> {
    @Autowired
    public ComandaAplicacionService(ComandaAplicacionRepository repository) {
        super(repository);
    }

    @Override
    protected void validar(ComandaAplicacion entity, CasoValidar caso) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'validar'");
    }
}
