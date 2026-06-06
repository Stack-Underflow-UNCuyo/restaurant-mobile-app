package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.resenia.ReseniaCreateDto;
import com.cm.restaurant_server.business.domain.dto.resenia.ReseniaDto;
import com.cm.restaurant_server.business.domain.entity.Resenia;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ReseniaMapper extends BaseMapper<Resenia, ReseniaDto, ReseniaCreateDto, ReseniaCreateDto> {
    @Override
    @Mapping(target = "fechaResenia", ignore = true)
    @Mapping(target = "comanda", ignore = true)
    Resenia toEntityCreate(ReseniaCreateDto dto);

    @Override
    @Mapping(target = "fechaResenia", ignore = true)
    @Mapping(target = "comanda", ignore = true)
    Resenia toUpdate(@MappingTarget Resenia entity, ReseniaCreateDto dto);

    @Override
    @Mapping(target = "comandaId", source = "comanda.id")
    ReseniaDto toDTO(Resenia entity);
}
