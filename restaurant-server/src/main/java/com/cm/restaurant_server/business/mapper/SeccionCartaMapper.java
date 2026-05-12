package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.seccioncarta.SeccionCartaCreateDto;
import com.cm.restaurant_server.business.domain.dto.seccioncarta.SeccionCartaDto;
import com.cm.restaurant_server.business.domain.entity.SeccionCarta;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SeccionCartaMapper extends BaseMapper<SeccionCarta, SeccionCartaDto, SeccionCartaCreateDto, SeccionCartaCreateDto> {

    @Override
    @Mapping(target = "categoria", ignore = true)
    @Mapping(target = "carta", ignore = true)
    SeccionCarta toEntityCreate(SeccionCartaCreateDto dto);

    @Override
    @Mapping(target = "categoria", ignore = true)
    @Mapping(target = "carta", ignore = true)
    SeccionCarta toUpdate(@MappingTarget SeccionCarta entity, SeccionCartaCreateDto dto);
}
