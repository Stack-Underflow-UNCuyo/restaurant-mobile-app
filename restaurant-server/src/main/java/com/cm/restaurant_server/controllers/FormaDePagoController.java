package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.formadepago.FormaDePagoCreateDto;
import com.cm.restaurant_server.business.domain.dto.formadepago.FormaDePagoDto;
import com.cm.restaurant_server.business.domain.entity.FormaDePago;
import com.cm.restaurant_server.business.logic.service.FormaDePagoService;
import com.cm.restaurant_server.business.mapper.FormaDePagoMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/formas-de-pago")
public class FormaDePagoController extends BaseController<FormaDePago, FormaDePagoDto, FormaDePagoCreateDto, FormaDePagoCreateDto> {

    public FormaDePagoController(FormaDePagoService service, FormaDePagoMapper mapper) {
        super(service, mapper);
    }
}
