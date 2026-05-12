package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.detalleseccioncarta.DetalleSeccionCartaCreateDto;
import com.cm.restaurant_server.business.domain.dto.detalleseccioncarta.DetalleSeccionCartaDto;
import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCarta;
import com.cm.restaurant_server.business.logic.service.DetalleSeccionCartaService;
import com.cm.restaurant_server.business.mapper.DetalleSeccionCartaMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/detalles-seccion-carta")
public class DetalleSeccionCartaController extends BaseController<DetalleSeccionCarta, DetalleSeccionCartaDto, DetalleSeccionCartaCreateDto, DetalleSeccionCartaCreateDto> {

    public DetalleSeccionCartaController(DetalleSeccionCartaService service, DetalleSeccionCartaMapper mapper) {
        super(service, mapper);
    }
}
