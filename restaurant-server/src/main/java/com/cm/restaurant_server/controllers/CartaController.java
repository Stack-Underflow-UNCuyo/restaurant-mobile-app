package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.carta.CartaCreateDto;
import com.cm.restaurant_server.business.domain.dto.carta.CartaDto;
import com.cm.restaurant_server.business.domain.entity.Carta;
import com.cm.restaurant_server.business.logic.service.CartaService;
import com.cm.restaurant_server.business.mapper.CartaMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/cartas")
public class CartaController extends BaseController<Carta, CartaDto, CartaCreateDto, CartaCreateDto> {

    public CartaController(CartaService service, CartaMapper mapper) {
        super(service, mapper);
    }

    @Override
    @PostMapping
    public ResponseEntity<CartaDto> save(@Valid @RequestBody CartaCreateDto dto) throws Exception {
        Carta carta = ((CartaService) service).crearCarta(dto.getSeccionCartaId(), dto.getFechaDesde(), dto.getFechaHasta());
        return ResponseEntity.ok(mapper.toDTO(carta));
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<CartaDto> update(@PathVariable String id, @Valid @RequestBody CartaCreateDto dto) throws Exception {
        Carta carta = ((CartaService) service).modificarCarta(id, dto.getSeccionCartaId(), dto.getFechaDesde(), dto.getFechaHasta());
        return ResponseEntity.ok(mapper.toDTO(carta));
    }

    @GetMapping("/todos")
    public ResponseEntity<Collection<CartaDto>> getTodos() {
        Collection<Carta> cartas = ((CartaService) service).listarCarta();
        return ResponseEntity.ok(cartas.stream().map(mapper::toDTO).collect(Collectors.toList()));
    }
}
