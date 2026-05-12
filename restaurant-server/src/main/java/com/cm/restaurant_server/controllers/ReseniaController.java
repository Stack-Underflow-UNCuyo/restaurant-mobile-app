package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.resenia.ReseniaCreateDto;
import com.cm.restaurant_server.business.domain.dto.resenia.ReseniaDto;
import com.cm.restaurant_server.business.domain.entity.Resenia;
import com.cm.restaurant_server.business.logic.service.ReseniaService;
import com.cm.restaurant_server.business.mapper.ReseniaMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/resenias")
public class ReseniaController extends BaseController<Resenia, ReseniaDto, ReseniaCreateDto, ReseniaCreateDto> {

    public ReseniaController(ReseniaService service, ReseniaMapper mapper) {
        super(service, mapper);
    }
}
