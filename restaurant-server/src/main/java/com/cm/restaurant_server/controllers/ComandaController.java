package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.comanda.ComandaCreateDto;
import com.cm.restaurant_server.business.domain.dto.comanda.ComandaDto;
import com.cm.restaurant_server.business.domain.dto.detallecomanda.DetalleComandaCreateDto;
import com.cm.restaurant_server.business.domain.dto.detallecomanda.DetalleComandaDto;
import com.cm.restaurant_server.business.domain.dto.resenia.ReseniaCreateDto;
import com.cm.restaurant_server.business.domain.dto.resenia.ReseniaDto;
import com.cm.restaurant_server.business.domain.entity.Comanda;
import com.cm.restaurant_server.business.domain.entity.DetalleComanda;
import com.cm.restaurant_server.business.domain.entity.Resenia;
import com.cm.restaurant_server.business.logic.service.ComandaService;
import com.cm.restaurant_server.business.logic.service.DetalleComandaService;
import com.cm.restaurant_server.business.logic.service.DetalleSeccionCartaService;
import com.cm.restaurant_server.business.logic.service.ReseniaService;
import com.cm.restaurant_server.business.mapper.ComandaMapper;
import com.cm.restaurant_server.business.mapper.DetalleComandaMapper;
import com.cm.restaurant_server.business.mapper.ReseniaMapper;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/comandas")
public class ComandaController extends BaseController<Comanda, ComandaDto, ComandaCreateDto, ComandaCreateDto> {

    private final DetalleComandaService detalleComandaService;
    private final DetalleComandaMapper detalleComandaMapper;
    private final DetalleSeccionCartaService detalleSeccionCartaService;
    private final ReseniaService reseniaService;
    private final ReseniaMapper reseniaMapper;

    public ComandaController(ComandaService service, ComandaMapper mapper,
            DetalleComandaService detalleComandaService, DetalleComandaMapper detalleComandaMapper,
            DetalleSeccionCartaService detalleSeccionCartaService,
            ReseniaService reseniaService, ReseniaMapper reseniaMapper) {
        super(service, mapper);
        this.detalleComandaService = detalleComandaService;
        this.detalleComandaMapper = detalleComandaMapper;
        this.detalleSeccionCartaService = detalleSeccionCartaService;
        this.reseniaService = reseniaService;
        this.reseniaMapper = reseniaMapper;
    }

    @GetMapping("/{id}/detalles")
    public ResponseEntity<List<DetalleComandaDto>> getDetalles(@PathVariable String id) throws Exception {
        List<DetalleComanda> detalles = ((ComandaService) service).listarDetalleComanda(id);
        return ResponseEntity.ok(detalleComandaMapper.toDTOsList(detalles));
    }

    @PostMapping("/{id}/detalles")
    public ResponseEntity<DetalleComandaDto> addDetalle(@PathVariable String id,
            @Valid @RequestBody DetalleComandaCreateDto dto) throws Exception {
        dto.setComandaId(id);
        DetalleComanda entity = detalleComandaMapper.toEntityCreate(dto);
        entity.setComanda(service.findById(id));
        entity.setDetalleSeccionCarta(detalleSeccionCartaService.buscarDetalleSeccionCarta(dto.getDetalleSeccionCartaId()));
        DetalleComanda saved = detalleComandaService.save(entity);
        return ResponseEntity.ok(detalleComandaMapper.toDTO(saved));
    }

    @PutMapping("/{id}/detalles/{detalleId}")
    public ResponseEntity<DetalleComandaDto> updateDetalle(@PathVariable String id, @PathVariable String detalleId,
            @Valid @RequestBody DetalleComandaCreateDto dto) throws Exception {
        dto.setComandaId(id);
        DetalleComanda existing = detalleComandaService.findById(detalleId);
        detalleComandaMapper.toUpdate(existing, dto);
        existing.setDetalleSeccionCarta(detalleSeccionCartaService.buscarDetalleSeccionCarta(dto.getDetalleSeccionCartaId()));
        DetalleComanda updated = detalleComandaService.update(detalleId, existing);
        return ResponseEntity.ok(detalleComandaMapper.toDTO(updated));
    }

    @DeleteMapping("/{id}/detalles/{detalleId}")
    public ResponseEntity<Void> deleteDetalle(@PathVariable String id, @PathVariable String detalleId) throws Exception {
        detalleComandaService.delete(detalleId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/resenias")
    public ResponseEntity<List<ReseniaDto>> getResenias(@PathVariable String id) throws Exception {
        List<Resenia> resenias = reseniaService.buscarPorComanda(id);
        return ResponseEntity.ok(reseniaMapper.toDTOsList(resenias));
    }

    @PostMapping("/{id}/resenias")
    public ResponseEntity<ReseniaDto> addResenia(@PathVariable String id,
            @Valid @RequestBody ReseniaCreateDto dto) throws Exception {
        dto.setComandaId(id);
        Resenia entity = reseniaMapper.toEntityCreate(dto);
        entity.setComanda(service.findById(id));
        Resenia saved = reseniaService.save(entity);
        return ResponseEntity.ok(reseniaMapper.toDTO(saved));
    }

    @PutMapping("/{id}/resenias/{reseniaId}")
    public ResponseEntity<ReseniaDto> updateResenia(@PathVariable String id, @PathVariable String reseniaId,
            @Valid @RequestBody ReseniaCreateDto dto) throws Exception {
        dto.setComandaId(id);
        Resenia existing = reseniaService.findById(reseniaId);
        reseniaMapper.toUpdate(existing, dto);
        existing.setComanda(service.findById(id));
        Resenia updated = reseniaService.update(reseniaId, existing);
        return ResponseEntity.ok(reseniaMapper.toDTO(updated));
    }

    @DeleteMapping("/{id}/resenias/{reseniaId}")
    public ResponseEntity<Void> deleteResenia(@PathVariable String id, @PathVariable String reseniaId) throws Exception {
        reseniaService.delete(reseniaId);
        return ResponseEntity.noContent().build();
    }
}
