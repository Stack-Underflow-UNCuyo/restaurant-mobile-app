package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.resenia.ReseniaCreateDto;
import com.cm.restaurant_server.business.domain.dto.resenia.ReseniaDto;
import com.cm.restaurant_server.business.domain.entity.Resenia;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ReseniaMapper extends BaseMapper<Resenia, ReseniaDto, ReseniaCreateDto, ReseniaCreateDto> {
}
