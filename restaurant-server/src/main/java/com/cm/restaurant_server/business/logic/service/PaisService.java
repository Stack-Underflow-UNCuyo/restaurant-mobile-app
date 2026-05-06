package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Pais;
import com.cm.restaurant_server.business.repository.PaisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaisService extends BaseService<Pais, String> {
    @Autowired
    public PaisService(PaisRepository repository) {
        super(repository);
    }
}