package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Categoria;
import com.cm.restaurant_server.business.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CategoriaService extends BaseService<Categoria> {
    @Autowired
    public CategoriaService(CategoriaRepository repository) {
        super(repository);
    }
}
