package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.comanda.ComandaCreateDto;
import com.cm.restaurant_server.business.domain.dto.comanda.ComandaDto;
import com.cm.restaurant_server.business.domain.entity.Comanda;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ComandaMapper extends BaseMapper<Comanda, ComandaDto, ComandaCreateDto, ComandaCreateDto> {

    @Override
    @Mapping(target = "cliente", ignore = true)
    @Mapping(target = "reservaMensa", ignore = true)
    Comanda toEntityCreate(ComandaCreateDto dto);

    @Override
    @Mapping(target = "cliente", ignore = true)
    @Mapping(target = "reservaMensa", ignore = true)
    Comanda toUpdate(@MappingTarget Comanda entity, ComandaCreateDto dto);

    @Override
    @Mapping(target = "clienteId", ignore = true)
    @Mapping(target = "reservaMensaId", ignore = true)
    ComandaDto toDTO(Comanda entity);
}
