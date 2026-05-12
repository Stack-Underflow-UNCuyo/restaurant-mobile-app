package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Promocion;
import com.cm.restaurant_server.business.repository.PromocionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PromocionService extends BaseService<Promocion> {
    @Autowired
    public PromocionService(PromocionRepository repository) {
        super(repository);
    }
}
