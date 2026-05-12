package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.menu.MenuCreateDto;
import com.cm.restaurant_server.business.domain.dto.menu.MenuDto;
import com.cm.restaurant_server.business.domain.entity.Menu;
import com.cm.restaurant_server.business.logic.service.MenuService;
import com.cm.restaurant_server.business.mapper.MenuMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/menus")
public class MenuController extends BaseController<Menu, MenuDto, MenuCreateDto, MenuCreateDto> {

    public MenuController(MenuService service, MenuMapper mapper) {
        super(service, mapper);
    }
}
