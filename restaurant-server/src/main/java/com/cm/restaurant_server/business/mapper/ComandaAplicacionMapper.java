package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.comanda.ComandaAplicacionCreateDto;
import com.cm.restaurant_server.business.domain.dto.comanda.ComandaAplicacionDto;
import com.cm.restaurant_server.business.domain.entity.ComandaAplicacion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ComandaAplicacionMapper extends
        BaseMapper<ComandaAplicacion, ComandaAplicacionDto, ComandaAplicacionCreateDto, ComandaAplicacionCreateDto> {

    @Override
    @Mapping(target = "cliente", ignore = true)
    ComandaAplicacion toEntityCreate(ComandaAplicacionCreateDto dto);

    @Override
    @Mapping(target = "cliente", ignore = true)
    ComandaAplicacion toUpdate(@MappingTarget ComandaAplicacion entity, ComandaAplicacionCreateDto dto);

    @Override
    @Mapping(target = "clienteId", ignore = true)
    @Mapping(target = "reservaMesaId", ignore = true)
    ComandaAplicacionDto toDTO(ComandaAplicacion entity);
}
