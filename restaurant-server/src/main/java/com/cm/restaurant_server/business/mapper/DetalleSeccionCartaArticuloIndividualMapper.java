package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.detalleseccioncarta.DetalleSeccionCartaArticuloIndividualCreateDto;
import com.cm.restaurant_server.business.domain.dto.detalleseccioncarta.DetalleSeccionCartaArticuloIndividualDto;
import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCartaArticuloIndividual;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DetalleSeccionCartaArticuloIndividualMapper extends BaseMapper<DetalleSeccionCartaArticuloIndividual, DetalleSeccionCartaArticuloIndividualDto, DetalleSeccionCartaArticuloIndividualCreateDto, DetalleSeccionCartaArticuloIndividualCreateDto> {

    @Override
    @Mapping(target = "seccionCarta", ignore = true)
    @Mapping(target = "articulo", ignore = true)
    DetalleSeccionCartaArticuloIndividual toEntityCreate(DetalleSeccionCartaArticuloIndividualCreateDto dto);

    @Override
    @Mapping(target = "seccionCarta", ignore = true)
    @Mapping(target = "articulo", ignore = true)
    DetalleSeccionCartaArticuloIndividual toUpdate(@MappingTarget DetalleSeccionCartaArticuloIndividual entity, DetalleSeccionCartaArticuloIndividualCreateDto dto);
}
