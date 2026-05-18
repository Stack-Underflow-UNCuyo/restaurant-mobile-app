package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCartaMenu;
import com.cm.restaurant_server.business.repository.DetalleSeccionCartaMenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DetalleSeccionCartaMenuService extends BaseService<DetalleSeccionCartaMenu> {
    @Autowired
    public DetalleSeccionCartaMenuService(DetalleSeccionCartaMenuRepository repository) {
        super(repository);
    }

    @Override
    protected void validar(DetalleSeccionCartaMenu entity, CasoValidar caso) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'validar'");
    }
}
