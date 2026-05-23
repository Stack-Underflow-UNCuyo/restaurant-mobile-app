package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.FormaDePago;
import com.cm.restaurant_server.business.repository.FormaDePagoRepository;

import org.springframework.stereotype.Service;

@Service
public class FormaDePagoService extends BaseService<FormaDePago> {
    public FormaDePagoService(FormaDePagoRepository repository) {
        super(repository);
    }

    @Override
    protected void validar(FormaDePago entity, CasoValidar caso) throws Exception {

    }
}
