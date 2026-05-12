package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.ContactoTelefonico;
import com.cm.restaurant_server.business.repository.ContactoTelefonicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ContactoTelefonicoService extends BaseService<ContactoTelefonico> {
    @Autowired
    public ContactoTelefonicoService(ContactoTelefonicoRepository repository) {
        super(repository);
    }
}
