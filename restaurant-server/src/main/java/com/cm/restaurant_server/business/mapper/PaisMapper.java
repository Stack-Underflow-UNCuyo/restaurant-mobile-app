package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.pais.PaisCreateDto;
import com.cm.restaurant_server.business.domain.dto.pais.PaisDto;
import com.cm.restaurant_server.business.domain.entity.Pais;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface PaisMapper extends BaseMapper<Pais, PaisDto, PaisCreateDto, PaisCreateDto> {
}
