package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.detallemenu.DetalleMenuCreateDto;
import com.cm.restaurant_server.business.domain.dto.detallemenu.DetalleMenuDto;
import com.cm.restaurant_server.business.domain.entity.DetalleMenu;
import com.cm.restaurant_server.business.logic.service.DetalleMenuService;
import com.cm.restaurant_server.business.mapper.DetalleMenuMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/detalles-menu")
public class DetalleMenuController extends BaseController<DetalleMenu, DetalleMenuDto, DetalleMenuCreateDto, DetalleMenuCreateDto> {

    public DetalleMenuController(DetalleMenuService service, DetalleMenuMapper mapper) {
        super(service, mapper);
    }
}
