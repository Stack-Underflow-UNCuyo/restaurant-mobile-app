package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Departamento;
import com.cm.restaurant_server.business.repository.DepartamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DepartamentoService extends BaseService<Departamento> {
    @Autowired
    public DepartamentoService(DepartamentoRepository repository) {
        super(repository);
    }
}