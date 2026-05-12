package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Empresa;
import com.cm.restaurant_server.business.repository.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmpresaService extends BaseService<Empresa> {
    @Autowired
    public EmpresaService(EmpresaRepository repository) {
        super(repository);
    }
}
