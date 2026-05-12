package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Empleado;
import com.cm.restaurant_server.business.repository.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmpleadoService extends BaseService<Empleado> {
    @Autowired
    public EmpleadoService(EmpleadoRepository repository) {
        super(repository);
    }
}
