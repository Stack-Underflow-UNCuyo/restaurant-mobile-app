package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.factura.FacturaCreateDto;
import com.cm.restaurant_server.business.domain.dto.factura.FacturaDto;
import com.cm.restaurant_server.business.domain.entity.Factura;
import com.cm.restaurant_server.business.logic.service.FacturaService;
import com.cm.restaurant_server.business.mapper.FacturaMapper;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/facturas")
public class FacturaController extends BaseController<Factura, FacturaDto, FacturaCreateDto, FacturaCreateDto> {

    private final FacturaService facturaService;

    public FacturaController(FacturaService service, FacturaMapper mapper) {
        super(service, mapper);
        this.facturaService = service;
    }

    @Override
    public ResponseEntity<FacturaDto> save(@Valid @RequestBody FacturaCreateDto createDto) throws Exception {
        Factura entity = mapper.toEntityCreate(createDto);
        Factura saved = facturaService.save(entity);
        facturaService.asignarDetalles(saved.getId(), createDto.getDetalleFacturaIds());
        return ResponseEntity.ok(mapper.toDTO(facturaService.findById(saved.getId())));
    }

    @Override
    public ResponseEntity<FacturaDto> update(@PathVariable String id, @Valid @RequestBody FacturaCreateDto updateDto)
            throws Exception {
        Factura existing = facturaService.findById(id);
        mapper.toUpdate(existing, updateDto);
        facturaService.update(id, existing);
        facturaService.reasignarDetalles(id, updateDto.getDetalleFacturaIds());
        return ResponseEntity.ok(mapper.toDTO(facturaService.findById(id)));
    }
}
