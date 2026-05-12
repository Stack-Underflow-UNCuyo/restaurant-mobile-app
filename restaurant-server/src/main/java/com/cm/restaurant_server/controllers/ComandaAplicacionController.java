package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.comanda.ComandaAplicacionCreateDto;
import com.cm.restaurant_server.business.domain.dto.comanda.ComandaAplicacionDto;
import com.cm.restaurant_server.business.domain.entity.ComandaAplicacion;
import com.cm.restaurant_server.business.logic.service.ComandaAplicacionService;
import com.cm.restaurant_server.business.mapper.ComandaAplicacionMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/comandas-aplicacion")
public class ComandaAplicacionController extends BaseController<ComandaAplicacion, ComandaAplicacionDto, ComandaAplicacionCreateDto, ComandaAplicacionCreateDto> {

    public ComandaAplicacionController(ComandaAplicacionService service, ComandaAplicacionMapper mapper) {
        super(service, mapper);
    }
}
