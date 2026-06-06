package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.detalleseccioncarta.DetalleSeccionCartaDto;
import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCarta;
import com.cm.restaurant_server.business.logic.service.DetalleSeccionCartaService;
import com.cm.restaurant_server.business.mapper.DetalleSeccionCartaMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/detalles-seccion-carta")
public class DetalleSeccionCartaController {

    private final DetalleSeccionCartaService service;
    private final DetalleSeccionCartaMapper mapper;

    public DetalleSeccionCartaController(DetalleSeccionCartaService service, DetalleSeccionCartaMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping
    public ResponseEntity<Collection<DetalleSeccionCartaDto>> getAll() {
        Collection<DetalleSeccionCarta> detalles = service.listarDetalleSeccionCartaActivo();
        return ResponseEntity.ok(detalles.stream().map(mapper::toDTO).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetalleSeccionCartaDto> getById(@PathVariable String id) throws Exception {
        DetalleSeccionCarta detalle = service.buscarDetalleSeccionCarta(id);
        return ResponseEntity.ok(mapper.toDTO(detalle));
    }

    @GetMapping("/todos")
    public ResponseEntity<Collection<DetalleSeccionCartaDto>> getTodos() {
        Collection<DetalleSeccionCarta> detalles = service.listarDetalleSeccionCarta();
        return ResponseEntity.ok(detalles.stream().map(mapper::toDTO).collect(Collectors.toList()));
    }
}
