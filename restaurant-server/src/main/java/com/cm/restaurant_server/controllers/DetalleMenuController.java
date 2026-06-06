package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.detallemenu.DetalleMenuCreateDto;
import com.cm.restaurant_server.business.domain.dto.detallemenu.DetalleMenuDto;
import com.cm.restaurant_server.business.domain.entity.DetalleMenu;
import com.cm.restaurant_server.business.logic.service.DetalleMenuService;
import com.cm.restaurant_server.business.mapper.DetalleMenuMapper;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/detalles-menu")
public class DetalleMenuController
        extends BaseController<DetalleMenu, DetalleMenuDto, DetalleMenuCreateDto, DetalleMenuCreateDto> {

    private final DetalleMenuService detalleMenuService;

    public DetalleMenuController(DetalleMenuService service, DetalleMenuMapper mapper) {
        super(service, mapper);
        this.detalleMenuService = service;
    }

    @Override
    @PostMapping
    public ResponseEntity<DetalleMenuDto> save(@Valid @RequestBody DetalleMenuCreateDto dto) throws Exception {
        DetalleMenu saved = detalleMenuService.crearDetalleMenuConArticulo(dto);
        return ResponseEntity.ok(mapper.toDTO(saved));
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<DetalleMenuDto> update(@PathVariable String id,
            @Valid @RequestBody DetalleMenuCreateDto dto) throws Exception {
        DetalleMenu updated = detalleMenuService.actualizarDetalleMenuConArticulo(id, dto);
        return ResponseEntity.ok(mapper.toDTO(updated));
    }
}
