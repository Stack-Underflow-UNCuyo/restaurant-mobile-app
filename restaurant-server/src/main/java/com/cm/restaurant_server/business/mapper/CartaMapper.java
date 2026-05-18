package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.carta.CartaCreateDto;
import com.cm.restaurant_server.business.domain.dto.carta.CartaDto;
import com.cm.restaurant_server.business.domain.entity.Carta;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CartaMapper extends BaseMapper<Carta, CartaDto, CartaCreateDto, CartaCreateDto> {

    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "eliminado", ignore = true)
    @Mapping(target = "seccionCarta", ignore = true)
    Carta toEntityCreate(CartaCreateDto dto);

    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "eliminado", ignore = true)
    @Mapping(target = "seccionCarta", ignore = true)
    Carta toUpdate(@MappingTarget Carta entity, CartaCreateDto dto);
}
