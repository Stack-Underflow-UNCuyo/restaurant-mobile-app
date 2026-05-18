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
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'validar'");
    }
}
