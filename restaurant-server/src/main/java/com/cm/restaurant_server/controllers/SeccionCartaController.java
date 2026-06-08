package com.cm.restaurant_server.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cm.restaurant_server.business.domain.dto.seccioncarta.SeccionCartaCreateDto;
import com.cm.restaurant_server.business.domain.dto.seccioncarta.SeccionCartaDto;
import com.cm.restaurant_server.business.domain.entity.SeccionCarta;
import com.cm.restaurant_server.business.logic.service.SeccionCartaService;
import com.cm.restaurant_server.business.mapper.SeccionCartaMapper;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/secciones-carta")
public class SeccionCartaController
        extends BaseController<SeccionCarta, SeccionCartaDto, SeccionCartaCreateDto, SeccionCartaCreateDto> {

    public SeccionCartaController(SeccionCartaService service, SeccionCartaMapper mapper) {
        super(service, mapper);
    }

    @Override
    @PostMapping
    public ResponseEntity<SeccionCartaDto> save(@Valid @RequestBody SeccionCartaCreateDto dto) throws Exception {
        System.out.println(dto);
        SeccionCarta saved = ((SeccionCartaService) service).crearSeccionCarta(dto.getCategoriaNombre(),
                dto.getNombre(), dto.getImagen());
        return ResponseEntity.ok(mapper.toDTO(saved));
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<SeccionCartaDto> update(@PathVariable String id,
            @Valid @RequestBody SeccionCartaCreateDto dto) throws Exception {
        SeccionCarta updated = ((SeccionCartaService) service).modificarSeccionCarta(id, dto.getCategoriaNombre(),
                dto.getNombre(), dto.getImagen());
        return ResponseEntity.ok(mapper.toDTO(updated));
    }
}
