package com.cm.restaurant_server.business.logic.service;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cm.restaurant_server.business.domain.entity.Categoria;
import com.cm.restaurant_server.business.repository.CategoriaRepository;

import jakarta.transaction.Transactional;

@Service
public class CategoriaService extends BaseService<Categoria> {

    private final CategoriaRepository repository;

    @Autowired
    public CategoriaService(CategoriaRepository repository) {
        super(repository);
        this.repository = repository;
    }

    @Override
    protected void validar(Categoria entity, CasoValidar caso) throws Exception {
        if (entity.getNombre() == null || entity.getNombre().isBlank()) {
            throw new Exception("El nombre de la categoría es obligatorio");
        }
    }

    private void validar(String nombre) throws Exception {
        if (nombre == null || nombre.isBlank()) {
            throw new Exception("El nombre de la categoría es obligatorio");
        }
    }

    @Transactional
    public Categoria crearCategoria(String nombre) throws Exception {
        validar(nombre);
        Categoria categoria = new Categoria();
        categoria.setNombre(nombre);
        save(categoria);
        return categoria;
    }

    @Transactional
    public Categoria buscarCategoria(String id) throws Exception {
        return findById(id);
    }

    @Transactional
    public Categoria buscarCategoriaPorNombre(String nombre) throws Exception {
        return repository.findByNombreAndEliminadoFalse(nombre)
                .orElseThrow(() -> new Exception("Categoría no encontrada con nombre: " + nombre));
    }

    @Transactional
    public void modificarCategoria(String id, String nombre) throws Exception {
        validar(nombre);
        Categoria categoria = findById(id);
        categoria.setNombre(nombre);
        update(id, categoria);
    }

    @Transactional
    public void eliminarCategoria(String id) throws Exception {
        delete(id);
    }

    @Transactional
    public Collection<Categoria> listarCategoria() {
        return repository.findAll();
    }

    @Transactional
    public Collection<Categoria> listarCategoriaActivo() throws Exception {
        return repository.findAllByEliminadoFalse();
    }
}
