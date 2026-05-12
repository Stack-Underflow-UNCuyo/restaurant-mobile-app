package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Carta;
import com.cm.restaurant_server.business.repository.CartaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartaService extends BaseService<Carta> {
    @Autowired
    public CartaService(CartaRepository repository) {
        super(repository);
    }
}
