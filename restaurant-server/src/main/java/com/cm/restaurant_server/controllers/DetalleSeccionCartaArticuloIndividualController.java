package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.detalleseccioncarta.DetalleSeccionCartaArticuloIndividualCreateDto;
import com.cm.restaurant_server.business.domain.dto.detalleseccioncarta.DetalleSeccionCartaArticuloIndividualDto;
import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCartaArticuloIndividual;
import com.cm.restaurant_server.business.logic.service.DetalleSeccionCartaArticuloIndividualService;
import com.cm.restaurant_server.business.mapper.DetalleSeccionCartaArticuloIndividualMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/detalles-seccion-carta-articulo")
public class DetalleSeccionCartaArticuloIndividualController extends BaseController<DetalleSeccionCartaArticuloIndividual, DetalleSeccionCartaArticuloIndividualDto, DetalleSeccionCartaArticuloIndividualCreateDto, DetalleSeccionCartaArticuloIndividualCreateDto> {

    public DetalleSeccionCartaArticuloIndividualController(DetalleSeccionCartaArticuloIndividualService service, DetalleSeccionCartaArticuloIndividualMapper mapper) {
        super(service, mapper);
    }
}
