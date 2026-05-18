package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.empleado.EmpleadoCreateDto;
import com.cm.restaurant_server.business.domain.dto.empleado.EmpleadoDto;
import com.cm.restaurant_server.business.domain.entity.Empleado;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = ContactoMapper.class)
public interface EmpleadoMapper extends BaseMapper<Empleado, EmpleadoDto, EmpleadoCreateDto, EmpleadoCreateDto> {

    @Override
    @Mapping(target = "contactos", ignore = true)
    @Mapping(target = "direccion", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    Empleado toEntity(EmpleadoDto dto);

    @Override
    @Mapping(target = "contactos", ignore = true)
    @Mapping(target = "direccion", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    Empleado toEntityCreate(EmpleadoCreateDto dto);

    @Override
    @Mapping(target = "contactos", ignore = true)
    @Mapping(target = "direccion", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    Empleado toUpdate(@MappingTarget Empleado entity, EmpleadoCreateDto dto);
}
