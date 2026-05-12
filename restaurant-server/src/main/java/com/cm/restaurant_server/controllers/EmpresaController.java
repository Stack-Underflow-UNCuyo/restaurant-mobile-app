package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.empresa.EmpresaCreateDto;
import com.cm.restaurant_server.business.domain.dto.empresa.EmpresaDto;
import com.cm.restaurant_server.business.domain.entity.Empresa;
import com.cm.restaurant_server.business.logic.service.EmpresaService;
import com.cm.restaurant_server.business.mapper.EmpresaMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/empresas")
public class EmpresaController extends BaseController<Empresa, EmpresaDto, EmpresaCreateDto, EmpresaCreateDto> {

    public EmpresaController(EmpresaService service, EmpresaMapper mapper) {
        super(service, mapper);
    }
}
