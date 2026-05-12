package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.menu.MenuCreateDto;
import com.cm.restaurant_server.business.domain.dto.menu.MenuDto;
import com.cm.restaurant_server.business.domain.entity.Menu;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MenuMapper extends BaseMapper<Menu, MenuDto, MenuCreateDto, MenuCreateDto> {
}
