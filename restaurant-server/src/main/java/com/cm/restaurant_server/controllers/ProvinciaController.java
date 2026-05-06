package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.provincia.ProvinciaCreateDto;
import com.cm.restaurant_server.business.domain.dto.provincia.ProvinciaDto;
import com.cm.restaurant_server.business.domain.entity.Provincia;
import com.cm.restaurant_server.business.logic.service.ProvinciaService;
import com.cm.restaurant_server.business.mapper.ProvinciaMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/provincias")
public class ProvinciaController extends BaseController<Provincia, ProvinciaDto, ProvinciaCreateDto, ProvinciaCreateDto> {

    public ProvinciaController(ProvinciaService service, ProvinciaMapper mapper) {
        super(service, mapper);
    }
}
