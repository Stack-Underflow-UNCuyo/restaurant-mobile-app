package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.UnidadDeMedida;
import com.cm.restaurant_server.business.repository.UnidadDeMedidaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UnidadDeMedidaService extends BaseService<UnidadDeMedida> {
    @Autowired
    public UnidadDeMedidaService(UnidadDeMedidaRepository repository) {
        super(repository);
    }

    @Override
    protected void validar(UnidadDeMedida entity, CasoValidar caso) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'validar'");
    }
}
