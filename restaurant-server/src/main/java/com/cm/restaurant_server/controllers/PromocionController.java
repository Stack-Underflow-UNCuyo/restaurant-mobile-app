package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.promocion.PromocionCreateDto;
import com.cm.restaurant_server.business.domain.dto.promocion.PromocionDto;
import com.cm.restaurant_server.business.domain.entity.Promocion;
import com.cm.restaurant_server.business.logic.service.PromocionService;
import com.cm.restaurant_server.business.mapper.PromocionMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/promociones")
public class PromocionController extends BaseController<Promocion, PromocionDto, PromocionCreateDto, PromocionCreateDto> {

    public PromocionController(PromocionService service, PromocionMapper mapper) {
        super(service, mapper);
    }
}
