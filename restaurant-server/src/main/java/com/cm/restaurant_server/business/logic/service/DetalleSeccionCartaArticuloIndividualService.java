package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Articulo;
import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCartaArticuloIndividual;
import com.cm.restaurant_server.business.domain.entity.SeccionCarta;
import com.cm.restaurant_server.business.repository.ArticuloRepository;
import com.cm.restaurant_server.business.repository.DetalleSeccionCartaArticuloIndividualRepository;
import com.cm.restaurant_server.business.repository.SeccionCartaRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class DetalleSeccionCartaArticuloIndividualService extends BaseService<DetalleSeccionCartaArticuloIndividual> {

    private final ArticuloRepository articuloRepository;
    private final SeccionCartaRepository seccionCartaRepository;
    private final ImagenService imagenService;

    public DetalleSeccionCartaArticuloIndividualService(
            DetalleSeccionCartaArticuloIndividualRepository repository,
            ArticuloRepository articuloRepository,
            SeccionCartaRepository seccionCartaRepository,
            ImagenService imagenService) {
        super(repository);
        this.articuloRepository = articuloRepository;
        this.seccionCartaRepository = seccionCartaRepository;
        this.imagenService = imagenService;
    }

    @Override
    protected void validar(DetalleSeccionCartaArticuloIndividual entity, CasoValidar caso) throws Exception {
        if (entity.getPrecio() <= 0) {
            throw new Exception("El precio del artículo individual debe ser mayor a cero");
        }
    }

    @Transactional
    public DetalleSeccionCartaArticuloIndividual crearDetalleArticulo(
            String seccionCartaId, double precio, String descripcion, String articuloId, com.cm.restaurant_server.business.domain.dto.imagen.ImagenCreateDto imagenDto) throws Exception {
        SeccionCarta seccionCarta = seccionCartaRepository.findByIdAndEliminadoFalse(seccionCartaId)
                .orElseThrow(() -> new Exception("Sección de la carta no encontrada con id: " + seccionCartaId));
        Articulo articulo = articuloRepository.findByIdAndEliminadoFalse(articuloId)
                .orElseThrow(() -> new Exception("Artículo no encontrado con id: " + articuloId));
        DetalleSeccionCartaArticuloIndividual detalle = new DetalleSeccionCartaArticuloIndividual();
        detalle.setSeccionCarta(seccionCarta);
        detalle.setPrecio(precio);
        detalle.setDescripcion(descripcion);
        detalle.setArticulo(articulo);
        
        if (imagenDto != null && imagenDto.getContenido() != null) {
            detalle.setImagen(imagenService.crearImagenLocal(imagenDto));
        }
        
        return save(detalle);
    }

    @Transactional
    public DetalleSeccionCartaArticuloIndividual modificarDetalleArticulo(
            String id, String seccionCartaId, double precio, String descripcion, String articuloId, com.cm.restaurant_server.business.domain.dto.imagen.ImagenCreateDto imagenDto) throws Exception {
        SeccionCarta seccionCarta = seccionCartaRepository.findByIdAndEliminadoFalse(seccionCartaId)
                .orElseThrow(() -> new Exception("Sección de la carta no encontrada con id: " + seccionCartaId));
        Articulo articulo = articuloRepository.findByIdAndEliminadoFalse(articuloId)
                .orElseThrow(() -> new Exception("Artículo no encontrado con id: " + articuloId));
        DetalleSeccionCartaArticuloIndividual detalle = findById(id);
        detalle.setSeccionCarta(seccionCarta);
        detalle.setPrecio(precio);
        detalle.setDescripcion(descripcion);
        detalle.setArticulo(articulo);
        
        if (imagenDto != null && imagenDto.getContenido() != null) {
            detalle.setImagen(imagenService.crearImagenLocal(imagenDto));
        }
        
        return update(id, detalle);
    }
}
