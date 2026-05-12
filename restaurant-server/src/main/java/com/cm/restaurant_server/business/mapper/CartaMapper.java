package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.carta.CartaCreateDto;
import com.cm.restaurant_server.business.domain.dto.carta.CartaDto;
import com.cm.restaurant_server.business.domain.entity.Carta;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CartaMapper extends BaseMapper<Carta, CartaDto, CartaCreateDto, CartaCreateDto> {
}
