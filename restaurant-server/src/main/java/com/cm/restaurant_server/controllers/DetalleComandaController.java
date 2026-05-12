package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.detallecomanda.DetalleComandaCreateDto;
import com.cm.restaurant_server.business.domain.dto.detallecomanda.DetalleComandaDto;
import com.cm.restaurant_server.business.domain.entity.DetalleComanda;
import com.cm.restaurant_server.business.logic.service.DetalleComandaService;
import com.cm.restaurant_server.business.mapper.DetalleComandaMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/detalles-comanda")
public class DetalleComandaController extends BaseController<DetalleComanda, DetalleComandaDto, DetalleComandaCreateDto, DetalleComandaCreateDto> {

    public DetalleComandaController(DetalleComandaService service, DetalleComandaMapper mapper) {
        super(service, mapper);
    }
}
