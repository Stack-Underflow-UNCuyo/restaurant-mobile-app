package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.empresa.EmpresaCreateDto;
import com.cm.restaurant_server.business.domain.dto.empresa.EmpresaDto;
import com.cm.restaurant_server.business.domain.entity.Empresa;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface EmpresaMapper extends BaseMapper<Empresa, EmpresaDto, EmpresaCreateDto, EmpresaCreateDto> {

    @Override
    @Mapping(target = "direccion", ignore = true)
    @Mapping(target = "contactos", ignore = true)
    Empresa toEntityCreate(EmpresaCreateDto dto);

    @Override
    @Mapping(target = "direccion", ignore = true)
    @Mapping(target = "contactos", ignore = true)
    Empresa toUpdate(@MappingTarget Empresa entity, EmpresaCreateDto dto);
}
