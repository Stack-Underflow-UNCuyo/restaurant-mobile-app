package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCarta;
import com.cm.restaurant_server.business.repository.DetalleSeccionCartaRepository;

import java.util.Collection;

import org.springframework.stereotype.Service;

@Service
public class DetalleSeccionCartaService {

    private final DetalleSeccionCartaRepository repository;

    public DetalleSeccionCartaService(DetalleSeccionCartaRepository repository) {
        this.repository = repository;
    }

    public DetalleSeccionCarta buscarDetalleSeccionCarta(String id) throws Exception {
        return repository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new Exception("Detalle de la Seccion de la Carta no encontrado con id: " + id));
    }

    public Collection<DetalleSeccionCarta> listarDetalleSeccionCarta() {
        return repository.findAll();
    }

    public Collection<DetalleSeccionCarta> listarDetalleSeccionCartaActivo() {
        return repository.findAllByEliminadoFalse();
    }
}
