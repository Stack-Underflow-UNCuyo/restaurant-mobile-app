package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.comanda.ComandaCreateDto;
import com.cm.restaurant_server.business.domain.dto.comanda.ComandaDto;
import com.cm.restaurant_server.business.domain.entity.Comanda;
import com.cm.restaurant_server.business.logic.service.ComandaService;
import com.cm.restaurant_server.business.mapper.ComandaMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/comandas")
public class ComandaController extends BaseController<Comanda, ComandaDto, ComandaCreateDto, ComandaCreateDto> {

    public ComandaController(ComandaService service, ComandaMapper mapper) {
        super(service, mapper);
    }
}
