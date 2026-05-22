package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.articulo.ArticuloCreateDto;
import com.cm.restaurant_server.business.domain.dto.articulo.ArticuloDto;
import com.cm.restaurant_server.business.domain.entity.Articulo;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = { UnidadDeMedidaMapper.class })
public interface ArticuloMapper extends BaseMapper<Articulo, ArticuloDto, ArticuloCreateDto, ArticuloCreateDto> {

    @Override
    @Mapping(target = "unidadDeMedida.id", source = "unidadDeMedidaId")
    Articulo toEntityCreate(ArticuloCreateDto dto);

    @Override
    @Mapping(target = "unidadDeMedida.id", source = "unidadDeMedidaId")
    Articulo toUpdate(@MappingTarget Articulo entity, ArticuloCreateDto dto);
}
