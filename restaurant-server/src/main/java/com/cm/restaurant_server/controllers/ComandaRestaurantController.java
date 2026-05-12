package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.comanda.ComandaRestaurantCreateDto;
import com.cm.restaurant_server.business.domain.dto.comanda.ComandaRestaurantDto;
import com.cm.restaurant_server.business.domain.entity.ComandaRestaurant;
import com.cm.restaurant_server.business.logic.service.ComandaRestaurantService;
import com.cm.restaurant_server.business.mapper.ComandaRestaurantMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/comandas-restaurant")
public class ComandaRestaurantController extends BaseController<ComandaRestaurant, ComandaRestaurantDto, ComandaRestaurantCreateDto, ComandaRestaurantCreateDto> {

    public ComandaRestaurantController(ComandaRestaurantService service, ComandaRestaurantMapper mapper) {
        super(service, mapper);
    }
}
