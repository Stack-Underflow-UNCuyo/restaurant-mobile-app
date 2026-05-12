package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.categoria.CategoriaCreateDto;
import com.cm.restaurant_server.business.domain.dto.categoria.CategoriaDto;
import com.cm.restaurant_server.business.domain.entity.Categoria;
import com.cm.restaurant_server.business.logic.service.CategoriaService;
import com.cm.restaurant_server.business.mapper.CategoriaMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/categorias")
public class CategoriaController extends BaseController<Categoria, CategoriaDto, CategoriaCreateDto, CategoriaCreateDto> {

    public CategoriaController(CategoriaService service, CategoriaMapper mapper) {
        super(service, mapper);
    }
}
