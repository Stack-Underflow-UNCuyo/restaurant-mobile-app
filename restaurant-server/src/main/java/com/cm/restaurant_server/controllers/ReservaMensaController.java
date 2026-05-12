package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.reservamensa.ReservaMensaCreateDto;
import com.cm.restaurant_server.business.domain.dto.reservamensa.ReservaMensaDto;
import com.cm.restaurant_server.business.domain.entity.ReservaMensa;
import com.cm.restaurant_server.business.logic.service.ReservaMensaService;
import com.cm.restaurant_server.business.mapper.ReservaMensaMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/reservas-mesa")
public class ReservaMensaController extends BaseController<ReservaMensa, ReservaMensaDto, ReservaMensaCreateDto, ReservaMensaCreateDto> {

    public ReservaMensaController(ReservaMensaService service, ReservaMensaMapper mapper) {
        super(service, mapper);
    }
}
