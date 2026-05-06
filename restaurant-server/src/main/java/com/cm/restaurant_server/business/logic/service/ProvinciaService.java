package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Provincia;
import com.cm.restaurant_server.business.repository.ProvinciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class ProvinciaService extends BaseService<Provincia> {
    @Autowired
    public ProvinciaService(ProvinciaRepository repository) {
        super(repository);
    }
}
