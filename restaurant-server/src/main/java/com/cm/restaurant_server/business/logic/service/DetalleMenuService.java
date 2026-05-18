package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.DetalleMenu;
import com.cm.restaurant_server.business.repository.DetalleMenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DetalleMenuService extends BaseService<DetalleMenu> {
    @Autowired
    public DetalleMenuService(DetalleMenuRepository repository) {
        super(repository);
    }

    @Override
    protected void validar(DetalleMenu entity, CasoValidar caso) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'validar'");
    }
}
