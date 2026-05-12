package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.carta.CartaCreateDto;
import com.cm.restaurant_server.business.domain.dto.carta.CartaDto;
import com.cm.restaurant_server.business.domain.entity.Carta;
import com.cm.restaurant_server.business.logic.service.CartaService;
import com.cm.restaurant_server.business.mapper.CartaMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/cartas")
public class CartaController extends BaseController<Carta, CartaDto, CartaCreateDto, CartaCreateDto> {

    public CartaController(CartaService service, CartaMapper mapper) {
        super(service, mapper);
    }
}
