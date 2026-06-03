package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.resenia.ReseniaCreateDto;
import com.cm.restaurant_server.business.domain.dto.resenia.ReseniaDto;
import com.cm.restaurant_server.business.domain.entity.Resenia;
import com.cm.restaurant_server.business.logic.service.ReseniaService;
import com.cm.restaurant_server.business.mapper.ReseniaMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/resenias")
public class ReseniaController extends BaseController<Resenia, ReseniaDto, ReseniaCreateDto, ReseniaCreateDto> {

    private final ReseniaMapper reseniaMapper;
    private final ReseniaService reseniaService;

    public ReseniaController(ReseniaService service, ReseniaMapper mapper) {
        super(service, mapper);
        this.reseniaMapper = mapper;
        this.reseniaService = service;
    }

    @Override
    public ResponseEntity<ReseniaDto> save(@Valid @RequestBody ReseniaCreateDto createDto) throws Exception {
        Resenia entity = reseniaMapper.toEntityCreate(createDto);
        entity.setFechaResenia(LocalDate.now().toString());
        Resenia saved = reseniaService.save(entity);
        return ResponseEntity.ok(reseniaMapper.toDTO(saved));
    }

    @Override
    public ResponseEntity<ReseniaDto> update(@PathVariable String id, @Valid @RequestBody ReseniaCreateDto updateDto) throws Exception {
        Resenia entity = reseniaMapper.toEntityCreate(updateDto);
        Resenia existing = reseniaService.findById(id);
        entity.setFechaResenia(existing.getFechaResenia());
        entity.setComanda(existing.getComanda());
        Resenia saved = reseniaService.update(id, entity);
        return ResponseEntity.ok(reseniaMapper.toDTO(saved));
    }
}
