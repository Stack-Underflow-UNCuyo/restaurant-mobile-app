package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Persona;
import com.cm.restaurant_server.business.repository.PersonaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PersonaService extends BaseService<Persona> {
    @Autowired
    public PersonaService(PersonaRepository repository) {
        super(repository);
    }
}
