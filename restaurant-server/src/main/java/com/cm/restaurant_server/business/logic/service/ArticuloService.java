package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Articulo;
import com.cm.restaurant_server.business.repository.ArticuloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ArticuloService extends BaseService<Articulo> {
    @Autowired
    public ArticuloService(ArticuloRepository repository) {
        super(repository);
    }
}
