package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.detalleseccioncarta.DetalleSeccionCartaMenuCreateDto;
import com.cm.restaurant_server.business.domain.dto.detalleseccioncarta.DetalleSeccionCartaMenuDto;
import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCartaMenu;
import com.cm.restaurant_server.business.logic.service.DetalleSeccionCartaMenuService;
import com.cm.restaurant_server.business.mapper.DetalleSeccionCartaMenuMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/detalles-seccion-carta-menu")
public class DetalleSeccionCartaMenuController extends BaseController<DetalleSeccionCartaMenu, DetalleSeccionCartaMenuDto, DetalleSeccionCartaMenuCreateDto, DetalleSeccionCartaMenuCreateDto> {

    public DetalleSeccionCartaMenuController(DetalleSeccionCartaMenuService service, DetalleSeccionCartaMenuMapper mapper) {
        super(service, mapper);
    }

    @Override
    @PostMapping
    public ResponseEntity<DetalleSeccionCartaMenuDto> save(@Valid @RequestBody DetalleSeccionCartaMenuCreateDto dto) throws Exception {
        DetalleSeccionCartaMenu detalle = ((DetalleSeccionCartaMenuService) service)
                .crearDetalleMenu(dto.getSeccionCartaId(), dto.getMenuId());
        return ResponseEntity.ok(((DetalleSeccionCartaMenuMapper) mapper).toDTO(detalle));
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<DetalleSeccionCartaMenuDto> update(@PathVariable String id, @Valid @RequestBody DetalleSeccionCartaMenuCreateDto dto) throws Exception {
        DetalleSeccionCartaMenu detalle = ((DetalleSeccionCartaMenuService) service)
                .modificarDetalleMenu(id, dto.getSeccionCartaId(), dto.getMenuId());
        return ResponseEntity.ok(((DetalleSeccionCartaMenuMapper) mapper).toDTO(detalle));
    }
}
