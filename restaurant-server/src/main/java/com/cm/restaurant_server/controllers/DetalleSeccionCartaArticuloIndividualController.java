package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.detalleseccioncarta.DetalleSeccionCartaArticuloIndividualCreateDto;
import com.cm.restaurant_server.business.domain.dto.detalleseccioncarta.DetalleSeccionCartaArticuloIndividualDto;
import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCartaArticuloIndividual;
import com.cm.restaurant_server.business.logic.service.DetalleSeccionCartaArticuloIndividualService;
import com.cm.restaurant_server.business.mapper.DetalleSeccionCartaArticuloIndividualMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/detalles-seccion-carta-articulo")
public class DetalleSeccionCartaArticuloIndividualController extends BaseController<DetalleSeccionCartaArticuloIndividual, DetalleSeccionCartaArticuloIndividualDto, DetalleSeccionCartaArticuloIndividualCreateDto, DetalleSeccionCartaArticuloIndividualCreateDto> {

    public DetalleSeccionCartaArticuloIndividualController(DetalleSeccionCartaArticuloIndividualService service, DetalleSeccionCartaArticuloIndividualMapper mapper) {
        super(service, mapper);
    }

    @Override
    @PostMapping
    public ResponseEntity<DetalleSeccionCartaArticuloIndividualDto> save(@Valid @RequestBody DetalleSeccionCartaArticuloIndividualCreateDto dto) throws Exception {
        DetalleSeccionCartaArticuloIndividual detalle = ((DetalleSeccionCartaArticuloIndividualService) service)
                .crearDetalleArticulo(dto.getSeccionCartaId(), dto.getPrecio(), dto.getDescripcion(), dto.getArticuloId());
        return ResponseEntity.ok(((DetalleSeccionCartaArticuloIndividualMapper) mapper).toDTO(detalle));
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<DetalleSeccionCartaArticuloIndividualDto> update(@PathVariable String id, @Valid @RequestBody DetalleSeccionCartaArticuloIndividualCreateDto dto) throws Exception {
        DetalleSeccionCartaArticuloIndividual detalle = ((DetalleSeccionCartaArticuloIndividualService) service)
                .modificarDetalleArticulo(id, dto.getSeccionCartaId(), dto.getPrecio(), dto.getDescripcion(), dto.getArticuloId());
        return ResponseEntity.ok(((DetalleSeccionCartaArticuloIndividualMapper) mapper).toDTO(detalle));
    }
}
