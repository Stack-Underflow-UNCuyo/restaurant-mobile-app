package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.detalleseccioncarta.DetalleSeccionCartaMenuCreateDto;
import com.cm.restaurant_server.business.domain.dto.detalleseccioncarta.DetalleSeccionCartaMenuDto;
import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCartaMenu;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DetalleSeccionCartaMenuMapper extends
        BaseMapper<DetalleSeccionCartaMenu, DetalleSeccionCartaMenuDto, DetalleSeccionCartaMenuCreateDto, DetalleSeccionCartaMenuCreateDto> {

    @Override
    @Mapping(target = "seccionCartaId", source = "seccionCarta.id")
    DetalleSeccionCartaMenuDto toDTO(DetalleSeccionCartaMenu entity);

    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "eliminado", ignore = true)
    @Mapping(target = "seccionCarta", ignore = true)
    @Mapping(target = "menu", ignore = true)
    DetalleSeccionCartaMenu toEntityCreate(DetalleSeccionCartaMenuCreateDto dto);

    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "eliminado", ignore = true)
    @Mapping(target = "seccionCarta", ignore = true)
    @Mapping(target = "menu", ignore = true)
    DetalleSeccionCartaMenu toUpdate(@MappingTarget DetalleSeccionCartaMenu entity,
            DetalleSeccionCartaMenuCreateDto dto);
}
