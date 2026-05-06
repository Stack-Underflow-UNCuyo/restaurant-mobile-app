package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.departamento.DepartamentoCreateDto;
import com.cm.restaurant_server.business.domain.dto.departamento.DepartamentoDto;
import com.cm.restaurant_server.business.domain.entity.Departamento;
import com.cm.restaurant_server.business.logic.service.DepartamentoService;
import com.cm.restaurant_server.business.mapper.DepartamentoMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/departamentos")
public class DepartamentoController extends BaseController<Departamento, DepartamentoDto, DepartamentoCreateDto, DepartamentoCreateDto> {

    public DepartamentoController(DepartamentoService service, DepartamentoMapper mapper) {
        super(service, mapper);
    }
}
