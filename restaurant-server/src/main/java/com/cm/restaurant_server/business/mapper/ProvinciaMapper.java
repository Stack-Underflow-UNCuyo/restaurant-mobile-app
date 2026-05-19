package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.provincia.ProvinciaCreateDto;
import com.cm.restaurant_server.business.domain.dto.provincia.ProvinciaDto;
import com.cm.restaurant_server.business.domain.entity.Provincia;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {PaisMapper.class})
public interface ProvinciaMapper extends BaseMapper<Provincia, ProvinciaDto, ProvinciaCreateDto, ProvinciaCreateDto> {

    @Override
    @Mapping(target = "pais.id", source = "paisId")
    Provincia toEntityCreate(ProvinciaCreateDto dto);

    @Override
    @Mapping(target = "pais.id", source = "paisId")
    Provincia toUpdate(@MappingTarget Provincia entity, ProvinciaCreateDto dto);

    @Override
    @Mapping(target = "paisId", ignore = true)
    ProvinciaDto toDTO(Provincia entity);
}
