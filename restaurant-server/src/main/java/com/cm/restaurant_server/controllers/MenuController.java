package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.detallemenu.DetalleMenuCreateDto;
import com.cm.restaurant_server.business.domain.dto.detallemenu.DetalleMenuDto;
import com.cm.restaurant_server.business.domain.dto.menu.MenuCreateDto;
import com.cm.restaurant_server.business.domain.dto.menu.MenuDto;
import com.cm.restaurant_server.business.domain.entity.DetalleMenu;
import com.cm.restaurant_server.business.domain.entity.Menu;
import com.cm.restaurant_server.business.logic.service.DetalleMenuService;
import com.cm.restaurant_server.business.logic.service.MenuService;
import com.cm.restaurant_server.business.mapper.DetalleMenuMapper;
import com.cm.restaurant_server.business.mapper.MenuMapper;
import com.cm.restaurant_server.business.repository.ArticuloRepository;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/menus")
public class MenuController extends BaseController<Menu, MenuDto, MenuCreateDto, MenuCreateDto> {

    private final MenuService menuService;
    private final DetalleMenuService detalleMenuService;
    private final DetalleMenuMapper detalleMenuMapper;
    private final ArticuloRepository articuloRepository;

    public MenuController(MenuService service, MenuMapper mapper,
            DetalleMenuService detalleMenuService, DetalleMenuMapper detalleMenuMapper,
            ArticuloRepository articuloRepository) {
        super(service, mapper);
        this.menuService = service;
        this.detalleMenuService = detalleMenuService;
        this.detalleMenuMapper = detalleMenuMapper;
        this.articuloRepository = articuloRepository;
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

    @GetMapping("/{id}/detalles-menu")
    public ResponseEntity<List<DetalleMenuDto>> getDetallesMenu(@PathVariable String id) throws Exception {
        List<DetalleMenu> detalles = menuService.listarDetalleMenu(id);
        return ResponseEntity.ok(detalleMenuMapper.toDTOsList(detalles));
    }

    @PostMapping("/{id}/detalles-menu")
    public ResponseEntity<DetalleMenuDto> addDetalleMenu(@PathVariable String id,
            @Valid @RequestBody DetalleMenuCreateDto dto) throws Exception {
        dto.setMenuId(id);
        DetalleMenu entity = detalleMenuMapper.toEntityCreate(dto);
        entity.setMenu(menuService.findById(id));
        if (dto.getArticuloId() != null) {
            entity.setArticulo(articuloRepository.findByIdAndEliminadoFalse(dto.getArticuloId())
                    .orElseThrow(() -> new RuntimeException("Artículo no encontrado: " + dto.getArticuloId())));
        }
        DetalleMenu saved = detalleMenuService.save(entity);
        return ResponseEntity.ok(detalleMenuMapper.toDTO(saved));
    }

    @PutMapping("/{id}/detalles-menu/{detalleId}")
    public ResponseEntity<DetalleMenuDto> updateDetalleMenu(@PathVariable String id,
            @PathVariable String detalleId, @Valid @RequestBody DetalleMenuCreateDto dto) throws Exception {
        dto.setMenuId(id);
        DetalleMenu existing = detalleMenuService.findById(detalleId);
        detalleMenuMapper.toUpdate(existing, dto);
        if (dto.getArticuloId() != null) {
            existing.setArticulo(articuloRepository.findByIdAndEliminadoFalse(dto.getArticuloId())
                    .orElseThrow(() -> new RuntimeException("Artículo no encontrado: " + dto.getArticuloId())));
        }
        DetalleMenu updated = detalleMenuService.update(detalleId, existing);
        return ResponseEntity.ok(detalleMenuMapper.toDTO(updated));
    }

    @DeleteMapping("/{id}/detalles-menu/{detalleId}")
    public ResponseEntity<Void> deleteDetalleMenu(@PathVariable String id, @PathVariable String detalleId)
            throws Exception {
        detalleMenuService.delete(detalleId);
        return ResponseEntity.noContent().build();
    }
}
