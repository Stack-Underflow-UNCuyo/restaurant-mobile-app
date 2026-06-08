package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.dto.imagen.ImagenCreateDto;
import com.cm.restaurant_server.business.domain.entity.Categoria;
import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCarta;
import com.cm.restaurant_server.business.domain.entity.SeccionCarta;
import com.cm.restaurant_server.business.repository.SeccionCartaRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class SeccionCartaService extends BaseService<SeccionCarta> {

    private final SeccionCartaRepository repository;
    private final CategoriaService categoriaService;
    private final ImagenService imagenService;

    @Autowired
    public SeccionCartaService(SeccionCartaRepository repository, CategoriaService categoriaService,
            ImagenService imagenService) {
        super(repository);
        this.repository = repository;
        this.categoriaService = categoriaService;
        this.imagenService = imagenService;
    }

    @Override
    protected void validar(SeccionCarta entity, CasoValidar caso) throws Exception {
        if (entity.getNombre() == null || entity.getNombre().isBlank()) {
            throw new Exception("El nombre de la sección de la carta es obligatorio");
        }
    }

    private Categoria resolverCategoria(String categoriaName) throws Exception {
        if (categoriaName == null || categoriaName.isBlank()) return null;
        try {
            return categoriaService.buscarCategoriaPorNombre(categoriaName);
        } catch (Exception e) {
            return categoriaService.crearCategoria(categoriaName);
        }
    }

    @Transactional
    public SeccionCarta crearSeccionCarta(String categoriaName, String nombre, ImagenCreateDto imagenDto) throws Exception {
        SeccionCarta seccionCarta = new SeccionCarta();
        seccionCarta.setNombre(nombre);
        seccionCarta.setCategoria(resolverCategoria(categoriaName));

        if (imagenDto != null && imagenDto.getContenido() != null) {
            seccionCarta.setImagen(imagenService.crearImagenLocal(imagenDto));
        }

        return save(seccionCarta);
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
    public SeccionCarta modificarSeccionCarta(String id, String categoriaName, String nombre, ImagenCreateDto imagenDto) throws Exception {
        SeccionCarta seccionCarta = findById(id);
        seccionCarta.setNombre(nombre);
        seccionCarta.setCategoria(resolverCategoria(categoriaName));

        if (imagenDto != null && imagenDto.getContenido() != null) {
            seccionCarta.setImagen(imagenService.crearImagenLocal(imagenDto));
        }

        return update(id, seccionCarta);
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
