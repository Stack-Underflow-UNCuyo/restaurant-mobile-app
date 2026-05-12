package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCarta;
import com.cm.restaurant_server.business.repository.DetalleSeccionCartaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DetalleSeccionCartaService extends BaseService<DetalleSeccionCarta> {
    @Autowired
    public DetalleSeccionCartaService(DetalleSeccionCartaRepository repository) {
        super(repository);
    }
}
