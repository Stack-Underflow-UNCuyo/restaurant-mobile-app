package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Categoria;
import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCarta;
import com.cm.restaurant_server.business.domain.entity.SeccionCarta;
import com.cm.restaurant_server.business.repository.CategoriaRepository;
import com.cm.restaurant_server.business.repository.SeccionCartaRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class SeccionCartaService extends BaseService<SeccionCarta> {

    private final SeccionCartaRepository repository;
    private final CategoriaRepository categoriaRepository;

    @Autowired
    public SeccionCartaService(SeccionCartaRepository repository, CategoriaRepository categoriaRepository) {
        super(repository);
        this.repository = repository;
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    protected void validar(SeccionCarta entity, CasoValidar caso) throws Exception {
        if (entity.getNombre() == null || entity.getNombre().isBlank()) {
            throw new Exception("El nombre de la sección de la carta es obligatorio");
        }
        if (entity.getCategoria() == null) {
            throw new Exception("La categoría de la sección de la carta es obligatoria");
        }
    }

    private void validar(String idCategoria, String nombre) throws Exception {
        if (nombre == null || nombre.isBlank()) {
            throw new Exception("El nombre de la sección de la carta es obligatorio");
        }
        if (idCategoria == null || idCategoria.isBlank()) {
            throw new Exception("El id de la categoría es obligatorio");
        }
    }

    @Transactional
    public void crearSeccionCarta(String idCategoria, String nombre) throws Exception {
        validar(idCategoria, nombre);
        Categoria categoria = categoriaRepository.findByIdAndEliminadoFalse(idCategoria)
                .orElseThrow(() -> new Exception("Categoría no encontrada con id: " + idCategoria));
        SeccionCarta seccionCarta = new SeccionCarta();
        seccionCarta.setNombre(nombre);
        seccionCarta.setCategoria(categoria);
        save(seccionCarta);
    }

    @Transactional
    public SeccionCarta buscarSeccionCarta(String id) throws Exception {
        return findById(id);
    }

    @Transactional
    public SeccionCarta buscarSeccionCartaPorCategoria(String idCategoria) throws Exception {
        return repository.findByCategoriaIdAndEliminadoFalse(idCategoria)
                .orElseThrow(() -> new Exception("Sección de la carta no encontrada para la categoría: " + idCategoria));
    }

    @Transactional
    public void modificarSeccionCarta(String id, String idCategoria, String nombre) throws Exception {
        validar(idCategoria, nombre);
        Categoria categoria = categoriaRepository.findByIdAndEliminadoFalse(idCategoria)
                .orElseThrow(() -> new Exception("Categoría no encontrada con id: " + idCategoria));
        SeccionCarta seccionCarta = findById(id);
        seccionCarta.setNombre(nombre);
        seccionCarta.setCategoria(categoria);
        update(id, seccionCarta);
    }

    @Transactional
    public void eliminarSeccionCarta(String id) throws Exception {
        delete(id);
    }

    @Transactional
    public Collection<SeccionCarta> listarSeccionCarta() {
        return repository.findAll();
    }

    @Transactional
    public Collection<SeccionCarta> listarSeccionCartaActivo() {
        return repository.findAllByEliminadoFalse();
    }

    @Transactional
    public Collection<SeccionCarta> listarSeccionCartaPorCategoriaActivo(String idCategoria) {
        return repository.findAllByCategoriaIdAndEliminadoFalse(idCategoria);
    }

    @Transactional
    public void agregarDetalleSeccionCarta(String id, DetalleSeccionCarta detalle) throws Exception {
        SeccionCarta seccionCarta = findById(id);
        detalle.setSeccionCarta(seccionCarta);
        seccionCarta.getDetallesSeccionCarta().add(detalle);
        baseRepository.save(seccionCarta);
    }
}
