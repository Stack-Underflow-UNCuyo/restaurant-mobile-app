package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.detallecomanda.DetalleComandaCreateDto;
import com.cm.restaurant_server.business.domain.dto.detallecomanda.DetalleComandaDto;
import com.cm.restaurant_server.business.domain.entity.DetalleComanda;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DetalleComandaMapper extends BaseMapper<DetalleComanda, DetalleComandaDto, DetalleComandaCreateDto, DetalleComandaCreateDto> {

    @Override
    @Mapping(target = "comanda", ignore = true)
    @Mapping(target = "detalleSeccionCarta", ignore = true)
    DetalleComanda toEntityCreate(DetalleComandaCreateDto dto);

    @Override
    @Mapping(target = "comanda", ignore = true)
    @Mapping(target = "detalleSeccionCarta", ignore = true)
    DetalleComanda toUpdate(@MappingTarget DetalleComanda entity, DetalleComandaCreateDto dto);

    @Override
    @Mapping(target = "comandaId", source = "comanda.id")
    @Mapping(target = "detalleSeccionCartaId", source = "detalleSeccionCarta.id")
    DetalleComandaDto toDTO(DetalleComanda entity);
}
