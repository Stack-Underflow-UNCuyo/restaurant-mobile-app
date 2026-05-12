package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.unidaddemedida.UnidadDeMedidaCreateDto;
import com.cm.restaurant_server.business.domain.dto.unidaddemedida.UnidadDeMedidaDto;
import com.cm.restaurant_server.business.domain.entity.UnidadDeMedida;
import com.cm.restaurant_server.business.logic.service.UnidadDeMedidaService;
import com.cm.restaurant_server.business.mapper.UnidadDeMedidaMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/unidades-de-medida")
public class UnidadDeMedidaController extends BaseController<UnidadDeMedida, UnidadDeMedidaDto, UnidadDeMedidaCreateDto, UnidadDeMedidaCreateDto> {

    public UnidadDeMedidaController(UnidadDeMedidaService service, UnidadDeMedidaMapper mapper) {
        super(service, mapper);
    }
}
