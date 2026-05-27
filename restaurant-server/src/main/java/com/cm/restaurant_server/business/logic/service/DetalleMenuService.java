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
        if (entity.getNombre() == null) {
            throw new Exception("El nombre es obligatoria");
        }
        if (entity.getCantidad() <= 0) {
            throw new Exception("La cantidad debe ser mayor a cero");
        }
        if (entity.getArticulo() == null) {
            throw new Exception("Debe tener un articulo relacionado");
        }
    }

}
