package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Contacto;
import com.cm.restaurant_server.business.logic.error.ErrorServiceException;
import com.cm.restaurant_server.business.repository.ContactoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ContactoService extends BaseService<Contacto> {
    @Autowired
    public ContactoService(ContactoRepository repository) {
        super(repository);
    }

    @Override
    protected void validar(Contacto contacto, CasoValidar caso) throws Exception {

    }
}
