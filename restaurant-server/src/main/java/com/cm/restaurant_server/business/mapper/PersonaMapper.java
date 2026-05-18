package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.persona.PersonaCreateDto;
import com.cm.restaurant_server.business.domain.dto.persona.PersonaDto;
import com.cm.restaurant_server.business.domain.entity.Persona;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = ContactoMapper.class)
public interface PersonaMapper extends BaseMapper<Persona, PersonaDto, PersonaCreateDto, PersonaCreateDto> {

    @Override
    @Mapping(target = "contactos", ignore = true)
    @Mapping(target = "direccion", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    Persona toEntity(PersonaDto dto);

    @Override
    @Mapping(target = "contactos", ignore = true)
    @Mapping(target = "direccion", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    Persona toEntityCreate(PersonaCreateDto dto);

    @Override
    @Mapping(target = "contactos", ignore = true)
    @Mapping(target = "direccion", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    Persona toUpdate(@MappingTarget Persona entity, PersonaCreateDto dto);
}
