package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCartaArticuloIndividual;
import com.cm.restaurant_server.business.repository.DetalleSeccionCartaArticuloIndividualRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DetalleSeccionCartaArticuloIndividualService extends BaseService<DetalleSeccionCartaArticuloIndividual> {
    @Autowired
    public DetalleSeccionCartaArticuloIndividualService(DetalleSeccionCartaArticuloIndividualRepository repository) {
        super(repository);
    }

    @Override
    protected void validar(DetalleSeccionCartaArticuloIndividual entity, CasoValidar caso) throws Exception {
        if (entity.getSeccionCarta() == null) {
            throw new Exception("El detalle debe pertenecer a una sección de la carta");
        }
        if (entity.getPrecio() <= 0) {
            throw new Exception("El precio del artículo individual debe ser mayor a cero");
        }
        if (caso == CasoValidar.UPDATE && (entity.getArticulos() == null || entity.getArticulos().isEmpty())) {
            throw new Exception("El detalle debe tener al menos un artículo");
        }
    }
}
