package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCarta;
import com.cm.restaurant_server.business.repository.DetalleSeccionCartaRepository;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

@Service
public class DetalleSeccionCartaService extends BaseService<DetalleSeccionCarta> {

    private DetalleSeccionCartaRepository repository;

    @Autowired
    public DetalleSeccionCartaService(DetalleSeccionCartaRepository repository) {
        super(repository);
        this.repository = repository;
    }

    @Override
    protected void validar(DetalleSeccionCarta entity, CasoValidar caso) throws Exception {
        if (entity.getSeccionCarta() == null) {
            throw new Exception("El detalle debe pertenecer a una sección de la carta");
        }
    }

    public DetalleSeccionCarta buscarDetalleSeccionCarta(String id) throws Exception {
        return repository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new Exception("Detalle de la Seccion de la Carta no encontrado con id: " + id));
    }

    public void eliminarDetalleSeccionCarta(@NonNull String id) throws Exception {
        repository.deleteById(id);
    }

    public Collection<DetalleSeccionCarta> listarDetalleSeccionCarta() {
        return repository.findAll();
    }

    public Collection<DetalleSeccionCarta> listarDetalleSeccionCartaActivo() {
        return repository.findAllByEliminadoFalse();
    }
}
