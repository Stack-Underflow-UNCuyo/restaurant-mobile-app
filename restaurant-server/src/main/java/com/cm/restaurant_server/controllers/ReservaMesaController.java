package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.reservamensa.ReservaMesaCreateDto;
import com.cm.restaurant_server.business.domain.dto.reservamensa.ReservaMesaDto;
import com.cm.restaurant_server.business.domain.entity.ReservaMesa;
import com.cm.restaurant_server.business.logic.service.ReservaMesaService;
import com.cm.restaurant_server.business.mapper.ReservaMesaMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/reservas-mesa")
public class ReservaMesaController
        extends BaseController<ReservaMesa, ReservaMesaDto, ReservaMesaCreateDto, ReservaMesaCreateDto> {

    public ReservaMesaController(ReservaMesaService service, ReservaMesaMapper mapper) {
        super(service, mapper);
    }
}
