package com.cm.restaurant_server.business.mapper;


import com.cm.restaurant_server.business.domain.dto.direccion.DireccionCreateDto;
import com.cm.restaurant_server.business.domain.dto.direccion.DireccionDto;
import com.cm.restaurant_server.business.domain.entity.Direccion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DireccionMapper extends BaseMapper<Direccion, DireccionDto, DireccionCreateDto, DireccionCreateDto> {

    @Override
    @Mapping(target = "localidad.id", source = "localidadId")
    Direccion toUpdate(@MappingTarget Direccion entity, DireccionCreateDto dto);

    @Override
    @Mapping(target = "localidad.id", source = "localidadId")
    Direccion toEntityCreate(DireccionCreateDto dto);

    @Override
    @Mapping(target = "localidadId", ignore = true)
    DireccionDto toDTO(Direccion entity);
}
