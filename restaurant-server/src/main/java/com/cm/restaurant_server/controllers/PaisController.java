package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.pais.PaisCreateDto;
import com.cm.restaurant_server.business.domain.dto.pais.PaisDto;
import com.cm.restaurant_server.business.domain.entity.Pais;
import com.cm.restaurant_server.business.logic.service.PaisService;
import com.cm.restaurant_server.business.mapper.PaisMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/paises")
public class PaisController extends BaseController<Pais, PaisDto, PaisCreateDto, PaisCreateDto> {

    public PaisController(PaisService service, PaisMapper mapper) {
        super(service, mapper);
    }
}