package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Articulo;
import com.cm.restaurant_server.business.repository.ArticuloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ArticuloService extends BaseService<Articulo> {

    private final ArticuloRepository repository;

    @Autowired
    public ArticuloService(ArticuloRepository repository) {
        super(repository);
        this.repository = repository;
    }

    public Articulo findByNombre(String nombre) throws Exception {
        return repository.findByNombreAndEliminadoFalse(nombre)
                .orElseThrow(() -> new Exception("Artículo no encontrado: " + nombre));
    }

    @Override
    protected void validar(Articulo entity, CasoValidar caso) throws Exception {
        if (entity.getNombre() == null || entity.getNombre().isBlank()) {
            throw new Exception("El nombre del artículo es obligatorio");
        }

        if (entity.getUnidadDeMedida() == null) {
            throw new Exception("La unidad de medida del artículo es obligatoria");
        }
    }
}
