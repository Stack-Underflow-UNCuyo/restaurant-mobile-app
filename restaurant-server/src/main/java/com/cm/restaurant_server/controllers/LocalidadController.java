package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.localidad.LocalidadCreateDto;
import com.cm.restaurant_server.business.domain.dto.localidad.LocalidadDto;
import com.cm.restaurant_server.business.domain.entity.Localidad;
import com.cm.restaurant_server.business.logic.service.LocalidadService;
import com.cm.restaurant_server.business.mapper.LocalidadMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/localidades")
public class LocalidadController extends BaseController<Localidad, LocalidadDto, LocalidadCreateDto, LocalidadCreateDto> {

    public LocalidadController(LocalidadService service, LocalidadMapper mapper) {
        super(service, mapper);
    }
}
