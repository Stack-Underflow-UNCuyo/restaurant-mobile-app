package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.mesarestaurante.MesaRestauranteCreateDto;
import com.cm.restaurant_server.business.domain.dto.mesarestaurante.MesaRestauranteDto;
import com.cm.restaurant_server.business.domain.entity.MesaRestaurante;
import com.cm.restaurant_server.business.logic.service.MesaRestauranteService;
import com.cm.restaurant_server.business.mapper.MesaRestauranteMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/mesas")
public class MesaRestauranteController extends BaseController<MesaRestaurante, MesaRestauranteDto, MesaRestauranteCreateDto, MesaRestauranteCreateDto> {

    public MesaRestauranteController(MesaRestauranteService service, MesaRestauranteMapper mapper) {
        super(service, mapper);
    }
}
