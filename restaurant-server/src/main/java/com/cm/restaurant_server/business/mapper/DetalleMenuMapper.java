package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.detallemenu.DetalleMenuCreateDto;
import com.cm.restaurant_server.business.domain.dto.detallemenu.DetalleMenuDto;
import com.cm.restaurant_server.business.domain.entity.DetalleMenu;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DetalleMenuMapper
        extends BaseMapper<DetalleMenu, DetalleMenuDto, DetalleMenuCreateDto, DetalleMenuCreateDto> {

    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "eliminado", ignore = true)
    @Mapping(target = "menu", ignore = true)
    @Mapping(target = "articulos", ignore = true)
    DetalleMenu toEntityCreate(DetalleMenuCreateDto dto);

    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "eliminado", ignore = true)
    @Mapping(target = "menu", ignore = true)
    @Mapping(target = "articulos", ignore = true)
    DetalleMenu toUpdate(@MappingTarget DetalleMenu entity, DetalleMenuCreateDto dto);
}
