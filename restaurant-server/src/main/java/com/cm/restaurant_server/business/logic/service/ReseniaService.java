package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Resenia;
import com.cm.restaurant_server.business.repository.ReseniaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReseniaService extends BaseService<Resenia> {
    @Autowired
    public ReseniaService(ReseniaRepository repository) {
        super(repository);
    }

    @Override
    protected void validar(Resenia entity, CasoValidar caso) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'validar'");
    }
}
