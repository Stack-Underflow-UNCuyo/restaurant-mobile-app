package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.localidad.LocalidadCreateDto;
import com.cm.restaurant_server.business.domain.dto.localidad.LocalidadDto;
import com.cm.restaurant_server.business.domain.entity.Localidad;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface LocalidadMapper extends BaseMapper<Localidad, LocalidadDto, LocalidadCreateDto, LocalidadCreateDto> {

    @Override
    @Mapping(target = "departamento", ignore = true)
    Localidad toUpdate(@MappingTarget Localidad entity, LocalidadCreateDto dto);

    @Override
    @Mapping(target = "departamentoId", ignore = true)
    LocalidadDto toDTO(Localidad entity);
}
