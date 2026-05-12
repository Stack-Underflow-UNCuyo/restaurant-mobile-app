package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.detalleseccioncarta.DetalleSeccionCartaMenuCreateDto;
import com.cm.restaurant_server.business.domain.dto.detalleseccioncarta.DetalleSeccionCartaMenuDto;
import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCartaMenu;
import com.cm.restaurant_server.business.logic.service.DetalleSeccionCartaMenuService;
import com.cm.restaurant_server.business.mapper.DetalleSeccionCartaMenuMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/detalles-seccion-carta-menu")
public class DetalleSeccionCartaMenuController extends BaseController<DetalleSeccionCartaMenu, DetalleSeccionCartaMenuDto, DetalleSeccionCartaMenuCreateDto, DetalleSeccionCartaMenuCreateDto> {

    public DetalleSeccionCartaMenuController(DetalleSeccionCartaMenuService service, DetalleSeccionCartaMenuMapper mapper) {
        super(service, mapper);
    }
}
