package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCartaArticuloIndividual;
import com.cm.restaurant_server.business.repository.DetalleSeccionCartaArticuloIndividualRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DetalleSeccionCartaArticuloIndividualService extends BaseService<DetalleSeccionCartaArticuloIndividual> {
    @Autowired
    public DetalleSeccionCartaArticuloIndividualService(DetalleSeccionCartaArticuloIndividualRepository repository) {
        super(repository);
    }

    @Override
    protected void validar(DetalleSeccionCartaArticuloIndividual entity, CasoValidar caso) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'validar'");
    }
}
