package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.ContactoCorreoElectronico;
import com.cm.restaurant_server.business.repository.ContactoCorreoElectronicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ContactoCorreoElectronicoService extends BaseService<ContactoCorreoElectronico> {
    @Autowired
    public ContactoCorreoElectronicoService(ContactoCorreoElectronicoRepository repository) {
        super(repository);
    }
}
