package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.direccion.DireccionCreateDto;
import com.cm.restaurant_server.business.domain.dto.direccion.DireccionDto;
import com.cm.restaurant_server.business.domain.entity.Direccion;
import com.cm.restaurant_server.business.logic.service.DireccionService;
import com.cm.restaurant_server.business.mapper.DireccionMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/direcciones")
public class DireccionController extends BaseController<Direccion, DireccionDto, DireccionCreateDto, DireccionCreateDto> {

    public DireccionController(DireccionService service, DireccionMapper mapper) {
        super(service, mapper);
    }
}