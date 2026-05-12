package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.mesarestaurante.MesaRestauranteCreateDto;
import com.cm.restaurant_server.business.domain.dto.mesarestaurante.MesaRestauranteDto;
import com.cm.restaurant_server.business.domain.entity.MesaRestaurante;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MesaRestauranteMapper extends BaseMapper<MesaRestaurante, MesaRestauranteDto, MesaRestauranteCreateDto, MesaRestauranteCreateDto> {
}
