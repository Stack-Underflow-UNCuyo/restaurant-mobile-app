package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.articulo.ArticuloCreateDto;
import com.cm.restaurant_server.business.domain.dto.articulo.ArticuloDto;
import com.cm.restaurant_server.business.domain.entity.Articulo;
import com.cm.restaurant_server.business.logic.service.ArticuloService;
import com.cm.restaurant_server.business.mapper.ArticuloMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/articulos")
public class ArticuloController extends BaseController<Articulo, ArticuloDto, ArticuloCreateDto, ArticuloCreateDto> {

    public ArticuloController(ArticuloService service, ArticuloMapper mapper) {
        super(service, mapper);
    }
}
