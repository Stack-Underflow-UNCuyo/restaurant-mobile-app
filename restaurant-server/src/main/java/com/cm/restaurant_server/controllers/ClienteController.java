package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.cliente.ClienteCreateDto;
import com.cm.restaurant_server.business.domain.dto.cliente.ClienteDto;
import com.cm.restaurant_server.business.domain.entity.Cliente;
import com.cm.restaurant_server.business.logic.service.ClienteService;
import com.cm.restaurant_server.business.mapper.ClienteMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/clientes")
public class ClienteController extends BaseController<Cliente, ClienteDto, ClienteCreateDto, ClienteCreateDto> {

    public ClienteController(ClienteService service, ClienteMapper mapper) {
        super(service, mapper);
    }

}
