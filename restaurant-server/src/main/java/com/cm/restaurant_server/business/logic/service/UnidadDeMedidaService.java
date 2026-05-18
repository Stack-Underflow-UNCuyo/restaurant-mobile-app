package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.UnidadDeMedida;
import com.cm.restaurant_server.business.repository.UnidadDeMedidaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UnidadDeMedidaService extends BaseService<UnidadDeMedida> {

    private final UnidadDeMedidaRepository repository;

    @Autowired
    public UnidadDeMedidaService(UnidadDeMedidaRepository repository) {
        super(repository);
        this.repository = repository;
    }

    public UnidadDeMedida findByNombre(String nombre) throws Exception {
        return repository.findByNombreAndEliminadoFalse(nombre)
                .orElseThrow(() -> new Exception("Unidad de medida no encontrada: " + nombre));
    }

    @Override
    protected void validar(UnidadDeMedida entity, CasoValidar caso) throws Exception {
        if (entity.getNombre() == null || entity.getNombre().isBlank()) {
            throw new Exception("El nombre de la unidad de medida es obligatorio");
        }
    }
}
