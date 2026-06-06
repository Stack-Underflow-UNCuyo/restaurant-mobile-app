package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.detalleseccioncarta.DetalleSeccionCartaCreateDto;
import com.cm.restaurant_server.business.domain.dto.detalleseccioncarta.DetalleSeccionCartaDto;
import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCarta;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DetalleSeccionCartaMapper extends BaseMapper<DetalleSeccionCarta, DetalleSeccionCartaDto, DetalleSeccionCartaCreateDto, DetalleSeccionCartaCreateDto> {

    @Override
    @Mapping(target = "seccionCartaId", source = "seccionCarta.id")
    DetalleSeccionCartaDto toDTO(DetalleSeccionCarta entity);

    @Override
    @Mapping(target = "seccionCarta", ignore = true)
    DetalleSeccionCarta toEntityCreate(DetalleSeccionCartaCreateDto dto);

    @Override
    @Mapping(target = "seccionCarta", ignore = true)
    DetalleSeccionCarta toUpdate(@MappingTarget DetalleSeccionCarta entity, DetalleSeccionCartaCreateDto dto);
}
