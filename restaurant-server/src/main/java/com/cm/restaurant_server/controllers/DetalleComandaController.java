package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.detallecomanda.DetalleComandaCreateDto;
import com.cm.restaurant_server.business.domain.dto.detallecomanda.DetalleComandaDto;
import com.cm.restaurant_server.business.domain.entity.DetalleComanda;
import com.cm.restaurant_server.business.logic.service.ComandaService;
import com.cm.restaurant_server.business.logic.service.DetalleComandaService;
import com.cm.restaurant_server.business.mapper.DetalleComandaMapper;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/detalles-comanda")
public class DetalleComandaController
        extends BaseController<DetalleComanda, DetalleComandaDto, DetalleComandaCreateDto, DetalleComandaCreateDto> {
    private final ComandaService comandaService;
    private static final String COMANDA_ID_KEY = "comandaId";

    public DetalleComandaController(DetalleComandaService service, DetalleComandaMapper mapper,
            ComandaService comandaService) {
        super(service, mapper);
        this.comandaService = comandaService;
    }

    @Override
    public ResponseEntity<List<DetalleComandaDto>> getAll(@RequestParam Map<String, String> params) throws Exception {
        List<DetalleComanda> entities;
        if (params.containsKey(COMANDA_ID_KEY)) {
            entities = this.comandaService.listarDetalleComanda(params.get(COMANDA_ID_KEY));
        } else {
            entities = this.service.findAll();
        }
        return ResponseEntity.ok(mapper.toDTOsList(entities)); // entity a dto
    }
}
