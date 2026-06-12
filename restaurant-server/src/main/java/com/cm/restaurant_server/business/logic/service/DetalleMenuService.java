package com.cm.restaurant_server.business.logic.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cm.restaurant_server.business.domain.dto.detallemenu.DetalleMenuCreateDto;
import com.cm.restaurant_server.business.domain.entity.Articulo;
import com.cm.restaurant_server.business.domain.entity.DetalleMenu;
import com.cm.restaurant_server.business.repository.ArticuloRepository;
import com.cm.restaurant_server.business.repository.DetalleMenuRepository;

@Service
public class DetalleMenuService extends BaseService<DetalleMenu> {

    private final ArticuloRepository articuloRepository;

    @Autowired
    public DetalleMenuService(DetalleMenuRepository repository, ArticuloRepository articuloRepository) {
        super(repository);
        this.articuloRepository = articuloRepository;
    }

    @Override
    protected void validar(DetalleMenu entity, CasoValidar caso) throws Exception {
        if (entity.getNombre() == null) {
            throw new Exception("El nombre es obligatorio");
        }
        if (entity.getCantidad() <= 0) {
            throw new Exception("La cantidad debe ser mayor a cero");
        }
        if (entity.getArticulo() == null) {
            throw new Exception("Debe tener un articulo relacionado");
        }
    }

    @Transactional
    public DetalleMenu crearDetalleMenuConArticulo(DetalleMenuCreateDto dto) throws Exception {
        DetalleMenu detalle = new DetalleMenu();
        detalle.setNombre(dto.getNombre());
        detalle.setCantidad(dto.getCantidad());

        if (dto.getArticuloId() != null) {
            Articulo articulo = articuloRepository.findByIdAndEliminadoFalse(dto.getArticuloId())
                    .orElseThrow(() -> new RuntimeException("Artículo no encontrado: " + dto.getArticuloId()));
            detalle.setArticulo(articulo);
            detalle.setArticuloCantidad(dto.getArticuloCantidad() > 0 ? dto.getArticuloCantidad() : dto.getCantidad());
        }
        return save(detalle);
    }

    @Transactional
    public DetalleMenu actualizarDetalleMenuConArticulo(String id, DetalleMenuCreateDto dto) throws Exception {
        DetalleMenu detalle = findById(id);
        detalle.setNombre(dto.getNombre());
        detalle.setCantidad(dto.getCantidad());

        if (dto.getArticuloId() != null) {
            Articulo articulo = articuloRepository.findByIdAndEliminadoFalse(dto.getArticuloId())
                    .orElseThrow(() -> new RuntimeException("Artículo no encontrado: " + dto.getArticuloId()));
            detalle.setArticulo(articulo);
            detalle.setArticuloCantidad(dto.getArticuloCantidad() > 0 ? dto.getArticuloCantidad() : dto.getCantidad());
        }
        return update(id, detalle);
    }
}
