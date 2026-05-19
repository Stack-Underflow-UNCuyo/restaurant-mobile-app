package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.detallefactura.DetalleFacturaCreateDto;
import com.cm.restaurant_server.business.domain.dto.detallefactura.DetalleFacturaDto;
import com.cm.restaurant_server.business.domain.entity.DetalleFactura;
import com.cm.restaurant_server.business.logic.service.DetalleFacturaService;
import com.cm.restaurant_server.business.logic.service.FacturaService;
import com.cm.restaurant_server.business.mapper.DetalleFacturaMapper;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/detalles-factura")
public class DetalleFacturaController
        extends BaseController<DetalleFactura, DetalleFacturaDto, DetalleFacturaCreateDto, DetalleFacturaCreateDto> {
    private final FacturaService facturaService;
    private static final String FACTURA_ID_KEY = "facturaId";

    public DetalleFacturaController(DetalleFacturaService service, DetalleFacturaMapper mapper,
            FacturaService facturaService) {
        super(service, mapper);
        this.facturaService = facturaService;
    }

    @Override
    public ResponseEntity<List<DetalleFacturaDto>> getAll(@RequestParam Map<String, String> params) throws Exception {
        List<DetalleFactura> entities;
        if (params.containsKey(FACTURA_ID_KEY)) {
            entities = this.facturaService.listarDetalleFactura(params.get(FACTURA_ID_KEY));
        } else {
            entities = this.service.findAll();
        }
        return ResponseEntity.ok(mapper.toDTOsList(entities));
    }
}
