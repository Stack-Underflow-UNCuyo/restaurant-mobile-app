package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Imagen;
import com.cm.restaurant_server.business.repository.ImagenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ImagenService extends BaseService<Imagen> {
    @Autowired
    public ImagenService(ImagenRepository repository) {
        super(repository);
    }

    @Override
    protected void validar(Imagen entity, CasoValidar caso) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'validar'");
    }
}
