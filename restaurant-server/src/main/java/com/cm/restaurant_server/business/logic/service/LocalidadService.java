package com.cm.restaurant_server.business.logic.service;


import com.cm.restaurant_server.business.domain.entity.Localidad;
import com.cm.restaurant_server.business.repository.LocalidadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LocalidadService extends BaseService<Localidad> {
    @Autowired
    public LocalidadService(LocalidadRepository repository) {
        super(repository);
    }
}
