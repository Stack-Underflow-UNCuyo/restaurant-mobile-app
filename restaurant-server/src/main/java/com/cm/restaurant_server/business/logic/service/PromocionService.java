package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Promocion;
import com.cm.restaurant_server.business.repository.PromocionRepository;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class PromocionService extends BaseService<Promocion> {
    public PromocionService(PromocionRepository repository) {
        super(repository);
    }

    @Override
    protected void validar(Promocion entity, CasoValidar caso) throws Exception {

    }

    public List<Promocion> buscarPromocionPorDescripcion(String descripcion) {
        return this.getRepository().findByDescripcionContainingIgnoreCase(descripcion.trim());
    }

    protected PromocionRepository getRepository() {
        return (PromocionRepository) this.baseRepository;
    }
}
