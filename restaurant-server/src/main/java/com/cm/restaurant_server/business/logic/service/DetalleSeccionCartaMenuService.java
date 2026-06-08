package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCartaMenu;
import com.cm.restaurant_server.business.domain.entity.Menu;
import com.cm.restaurant_server.business.domain.entity.SeccionCarta;
import com.cm.restaurant_server.business.repository.DetalleSeccionCartaMenuRepository;
import com.cm.restaurant_server.business.repository.MenuRepository;
import com.cm.restaurant_server.business.repository.SeccionCartaRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class DetalleSeccionCartaMenuService extends BaseService<DetalleSeccionCartaMenu> {

    private final MenuRepository menuRepository;
    private final SeccionCartaRepository seccionCartaRepository;
    private final ImagenService imagenService;

    public DetalleSeccionCartaMenuService(
            DetalleSeccionCartaMenuRepository repository,
            MenuRepository menuRepository,
            SeccionCartaRepository seccionCartaRepository,
            ImagenService imagenService) {
        super(repository);
        this.menuRepository = menuRepository;
        this.seccionCartaRepository = seccionCartaRepository;
        this.imagenService = imagenService;
    }

    @Override
    protected void validar(DetalleSeccionCartaMenu entity, CasoValidar caso) throws Exception {
        if (entity.getMenu() == null) {
            throw new Exception("El detalle debe tener un menú asociado");
        }
    }

    @Transactional
    public DetalleSeccionCartaMenu crearDetalleMenu(String seccionCartaId, String menuId, com.cm.restaurant_server.business.domain.dto.imagen.ImagenCreateDto imagenDto) throws Exception {
        SeccionCarta seccionCarta = seccionCartaRepository.findByIdAndEliminadoFalse(seccionCartaId)
                .orElseThrow(() -> new Exception("Sección de la carta no encontrada con id: " + seccionCartaId));
        Menu menu = menuRepository.findByIdAndEliminadoFalse(menuId)
                .orElseThrow(() -> new Exception("Menú no encontrado con id: " + menuId));
        DetalleSeccionCartaMenu detalle = new DetalleSeccionCartaMenu();
        detalle.setSeccionCarta(seccionCarta);
        detalle.setMenu(menu);
        
        if (imagenDto != null && imagenDto.getContenido() != null) {
            detalle.setImagen(imagenService.crearImagenLocal(imagenDto));
        }
        
        return save(detalle);
    }

    @Transactional
    public DetalleSeccionCartaMenu modificarDetalleMenu(String id, String seccionCartaId, String menuId, com.cm.restaurant_server.business.domain.dto.imagen.ImagenCreateDto imagenDto) throws Exception {
        SeccionCarta seccionCarta = seccionCartaRepository.findByIdAndEliminadoFalse(seccionCartaId)
                .orElseThrow(() -> new Exception("Sección de la carta no encontrada con id: " + seccionCartaId));
        Menu menu = menuRepository.findByIdAndEliminadoFalse(menuId)
                .orElseThrow(() -> new Exception("Menú no encontrado con id: " + menuId));
        DetalleSeccionCartaMenu detalle = findById(id);
        detalle.setSeccionCarta(seccionCarta);
        detalle.setMenu(menu);
        
        if (imagenDto != null && imagenDto.getContenido() != null) {
            detalle.setImagen(imagenService.crearImagenLocal(imagenDto));
        }
        
        return update(id, detalle);
    }
}
