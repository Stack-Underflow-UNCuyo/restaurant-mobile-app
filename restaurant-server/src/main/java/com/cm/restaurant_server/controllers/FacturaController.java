package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.factura.FacturaCreateDto;
import com.cm.restaurant_server.business.domain.dto.factura.FacturaDto;
import com.cm.restaurant_server.business.domain.entity.Factura;
import com.cm.restaurant_server.business.logic.service.FacturaService;
import com.cm.restaurant_server.business.mapper.FacturaMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/facturas")
public class FacturaController extends BaseController<Factura, FacturaDto, FacturaCreateDto, FacturaCreateDto> {

    public FacturaController(FacturaService service, FacturaMapper mapper) {
        super(service, mapper);
    }
}
