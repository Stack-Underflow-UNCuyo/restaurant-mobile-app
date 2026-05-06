package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.departamento.DepartamentoCreateDto;
import com.cm.restaurant_server.business.domain.dto.departamento.DepartamentoDto;
import com.cm.restaurant_server.business.domain.entity.Departamento;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DepartamentoMapper extends BaseMapper<Departamento, DepartamentoDto, DepartamentoCreateDto, DepartamentoCreateDto> {
    @Override
    @Mapping(target = "provincia", ignore = true)
    Departamento toUpdate(@MappingTarget Departamento entity, DepartamentoCreateDto dto);

    @Override
    @Mapping(target = "provinciaId", ignore = true)
    DepartamentoDto toDTO(Departamento entity);
}
