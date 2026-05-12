package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.contacto.ContactoCreateDto;
import com.cm.restaurant_server.business.domain.dto.contacto.ContactoDto;
import com.cm.restaurant_server.business.domain.entity.Contacto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ContactoMapper extends BaseMapper<Contacto, ContactoDto, ContactoCreateDto, ContactoCreateDto> {

    @Override
    @Mapping(target = "persona", ignore = true)
    Contacto toEntityCreate(ContactoCreateDto dto);

    @Override
    @Mapping(target = "persona", ignore = true)
    Contacto toUpdate(@MappingTarget Contacto entity, ContactoCreateDto dto);

    @Override
    @Mapping(target = "personaId", ignore = true)
    ContactoDto toDTO(Contacto entity);
}
