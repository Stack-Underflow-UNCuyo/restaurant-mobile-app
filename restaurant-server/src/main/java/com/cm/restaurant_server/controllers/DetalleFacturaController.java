package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.detallefactura.DetalleFacturaCreateDto;
import com.cm.restaurant_server.business.domain.dto.detallefactura.DetalleFacturaDto;
import com.cm.restaurant_server.business.domain.entity.DetalleFactura;
import com.cm.restaurant_server.business.logic.service.DetalleFacturaService;
import com.cm.restaurant_server.business.mapper.DetalleFacturaMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/detalles-factura")
public class DetalleFacturaController extends BaseController<DetalleFactura, DetalleFacturaDto, DetalleFacturaCreateDto, DetalleFacturaCreateDto> {

    public DetalleFacturaController(DetalleFacturaService service, DetalleFacturaMapper mapper) {
        super(service, mapper);
    }
}
