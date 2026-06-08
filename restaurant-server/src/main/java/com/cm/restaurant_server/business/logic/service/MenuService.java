package com.cm.restaurant_server.business.logic.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import com.cm.restaurant_server.business.domain.dto.detallemenu.DetalleMenuCreateDto;
import com.cm.restaurant_server.business.domain.dto.menu.MenuCreateDto;
import com.cm.restaurant_server.business.domain.entity.Articulo;
import com.cm.restaurant_server.business.domain.entity.DetalleMenu;
import com.cm.restaurant_server.business.domain.entity.DetalleMenuArticulo;
import com.cm.restaurant_server.business.domain.entity.Menu;
import com.cm.restaurant_server.business.repository.ArticuloRepository;
import com.cm.restaurant_server.business.repository.DetalleMenuRepository;
import com.cm.restaurant_server.business.repository.MenuRepository;

@Service
public class MenuService extends BaseService<Menu> {

    private final MenuRepository menuRepository;
    private final DetalleMenuRepository detalleMenuRepository;
    private final ArticuloRepository articuloRepository;
    private final ImagenService imagenService;

    public MenuService(MenuRepository menuRepository,
            DetalleMenuRepository detalleMenuRepository,
            ArticuloRepository articuloRepository,
            ImagenService imagenService) {
        super(menuRepository);
        this.menuRepository = menuRepository;
        this.detalleMenuRepository = detalleMenuRepository;
        this.articuloRepository = articuloRepository;
        this.imagenService = imagenService;
    }

    @Override
    protected void validar(Menu entity, CasoValidar caso) throws Exception {
        if (entity.getPrecio() <= 0) {
            throw new Exception("El precio del menú debe ser mayor a cero");
        }
        if (caso == CasoValidar.UPDATE && (entity.getDetallesMenu() == null || entity.getDetallesMenu().isEmpty())) {
            throw new Exception("El menú debe tener al menos un detalle");
        }
    }

    @Transactional
    public Menu crearMenuConDetalles(MenuCreateDto dto) {
        Menu menu = new Menu();
        menu.setNombre(dto.getNombre());
        menu.setDescripcion(dto.getDescripcion());
        menu.setPrecio(dto.getPrecio());
        
        try {
            if (dto.getImagen() != null) {
                menu.setImagen(imagenService.crearImagenLocal(dto.getImagen()));
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar la imagen", e);
        }

        Menu menuGuardado = menuRepository.save(menu);

        if (dto.getDetallesMenu() != null) {
            for (DetalleMenuCreateDto detalleDto : dto.getDetallesMenu()) {
                DetalleMenu detalle = new DetalleMenu();
                detalle.setNombre(detalleDto.getNombre());
                detalle.setCantidad(detalleDto.getCantidad());
                detalle.setMenu(menuGuardado);

                List<DetalleMenuArticulo> articulosList = new ArrayList<>();
                if (detalleDto.getArticuloId() != null) {
                    Articulo articulo = articuloRepository.findByIdAndEliminadoFalse(detalleDto.getArticuloId())
                            .orElseThrow(() -> new RuntimeException(
                                    "Artículo no encontrado: " + detalleDto.getArticuloId()));
                    DetalleMenuArticulo dma = new DetalleMenuArticulo();
                    dma.setDetalleMenu(detalle);
                    dma.setArticulo(articulo);
                    dma.setCantidad(detalleDto.getArticuloCantidad() > 0 ? detalleDto.getArticuloCantidad() : detalleDto.getCantidad());
                    articulosList.add(dma);
                }
                detalle.setArticulos(articulosList);
                detalleMenuRepository.save(detalle);
            }
        }

        return menuRepository.findByIdAndEliminadoFalse(menuGuardado.getId())
                .orElse(menuGuardado);
    }

    @Transactional
    public Menu actualizarMenuConDetalles(String id, MenuCreateDto dto) {
        Menu menu = menuRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new RuntimeException("Menú no encontrado: " + id));
        menu.setNombre(dto.getNombre());
        menu.setDescripcion(dto.getDescripcion());
        menu.setPrecio(dto.getPrecio());
        
        try {
            if (dto.getImagen() != null && dto.getImagen().getContenido() != null) {
                menu.setImagen(imagenService.crearImagenLocal(dto.getImagen()));
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar la imagen", e);
        }

        menu.getDetallesMenu().clear();

        if (dto.getDetallesMenu() != null) {
            for (DetalleMenuCreateDto detalleDto : dto.getDetallesMenu()) {
                DetalleMenu detalle = new DetalleMenu();
                detalle.setNombre(detalleDto.getNombre());
                detalle.setCantidad(detalleDto.getCantidad());
                detalle.setMenu(menu);

                List<DetalleMenuArticulo> articulosList = new ArrayList<>();
                if (detalleDto.getArticuloId() != null) {
                    Articulo articulo = articuloRepository.findByIdAndEliminadoFalse(detalleDto.getArticuloId())
                            .orElseThrow(() -> new RuntimeException(
                                    "Artículo no encontrado: " + detalleDto.getArticuloId()));
                    DetalleMenuArticulo dma = new DetalleMenuArticulo();
                    dma.setDetalleMenu(detalle);
                    dma.setArticulo(articulo);
                    dma.setCantidad(detalleDto.getArticuloCantidad() > 0 ? detalleDto.getArticuloCantidad() : detalleDto.getCantidad());
                    articulosList.add(dma);
                }
                detalle.setArticulos(articulosList);
                menu.getDetallesMenu().add(detalle);
            }
        }

        menuRepository.save(menu);
        return menuRepository.findByIdAndEliminadoFalse(id).orElse(menu);
    }
}
