package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.menu.MenuCreateDto;
import com.cm.restaurant_server.business.domain.dto.menu.MenuDto;
import com.cm.restaurant_server.business.domain.entity.Menu;
import org.mapstruct.Mapper;

import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MenuMapper extends BaseMapper<Menu, MenuDto, MenuCreateDto, MenuCreateDto> {
    
    @Override
    @Mapping(target = "imagenUrl", source = "imagen.url")
    @Mapping(target = "imagenNombre", source = "imagen.nombre")
    MenuDto toDTO(Menu entity);
}
