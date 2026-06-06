package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.menu.MenuCreateDto;
import com.cm.restaurant_server.business.domain.dto.menu.MenuDto;
import com.cm.restaurant_server.business.domain.entity.Menu;
import com.cm.restaurant_server.business.logic.service.MenuService;
import com.cm.restaurant_server.business.mapper.MenuMapper;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/menus")
public class MenuController extends BaseController<Menu, MenuDto, MenuCreateDto, MenuCreateDto> {

    private final MenuService menuService;

    public MenuController(MenuService service, MenuMapper mapper) {
        super(service, mapper);
        this.menuService = service;
    }

    @Override
    @PostMapping
    public ResponseEntity<MenuDto> save(@Valid @RequestBody MenuCreateDto dto) throws Exception {
        Menu menu = menuService.crearMenuConDetalles(dto);
        return ResponseEntity.ok(mapper.toDTO(menu));
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<MenuDto> update(@PathVariable String id,
            @Valid @RequestBody MenuCreateDto dto) throws Exception {
        Menu menu = menuService.actualizarMenuConDetalles(id, dto);
        return ResponseEntity.ok(mapper.toDTO(menu));
    }
}
