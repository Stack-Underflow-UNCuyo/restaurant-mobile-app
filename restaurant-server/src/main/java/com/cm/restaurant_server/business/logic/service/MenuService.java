package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Menu;
import com.cm.restaurant_server.business.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MenuService extends BaseService<Menu> {
    @Autowired
    public MenuService(MenuRepository repository) {
        super(repository);
    }

    @Override
    protected void validar(Menu entity, CasoValidar caso) throws Exception {
        if (entity.getPrecio() <= 0) {
            throw new Exception("El precio del menú debe ser mayor a cero");
        }
        // if (entity.getImagen() == null) {
        // throw new Exception("El menú debe tener una imagen");
        // }
        if (caso == CasoValidar.UPDATE && (entity.getDetallesMenu() == null || entity.getDetallesMenu().isEmpty())) {
            throw new Exception("El menú debe tener al menos un detalle");
        }
    }
}
