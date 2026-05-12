package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.cliente.ClienteCreateDto;
import com.cm.restaurant_server.business.domain.dto.cliente.ClienteDto;
import com.cm.restaurant_server.business.domain.entity.Cliente;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ClienteMapper extends BaseMapper<Cliente, ClienteDto, ClienteCreateDto, ClienteCreateDto> {

    @Override
    @Mapping(target = "direccion", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    Cliente toEntityCreate(ClienteCreateDto dto);

    @Override
    @Mapping(target = "direccion", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    Cliente toUpdate(@MappingTarget Cliente entity, ClienteCreateDto dto);
}
