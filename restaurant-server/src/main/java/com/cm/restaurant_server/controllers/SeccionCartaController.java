package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.seccioncarta.SeccionCartaCreateDto;
import com.cm.restaurant_server.business.domain.dto.seccioncarta.SeccionCartaDto;
import com.cm.restaurant_server.business.domain.entity.SeccionCarta;
import com.cm.restaurant_server.business.logic.service.SeccionCartaService;
import com.cm.restaurant_server.business.mapper.SeccionCartaMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/secciones-carta")
public class SeccionCartaController extends BaseController<SeccionCarta, SeccionCartaDto, SeccionCartaCreateDto, SeccionCartaCreateDto> {

    public SeccionCartaController(SeccionCartaService service, SeccionCartaMapper mapper) {
        super(service, mapper);
    }
}
