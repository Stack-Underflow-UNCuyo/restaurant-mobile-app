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
        if (entity.getNombre() == null || entity.getNombre().isBlank()) {
            throw new Exception("El nombre de la imagen es obligatorio");
        }

        if (entity.getMime() == null || entity.getMime().isBlank()) {
            throw new Exception("El tipo MIME de la imagen es obligatorio");
        }

        if (entity.getContenido() == null || entity.getContenido().length == 0) {
            throw new Exception("El contenido de la imagen es obligatorio");
        }

        if (entity.getTipoImagen() == null) {
            throw new Exception("El tipo de imagen es obligatorio");
        }
    }
}
