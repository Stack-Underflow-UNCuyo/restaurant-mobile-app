package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.contacto.ContactoTelefonicoCreateDto;
import com.cm.restaurant_server.business.domain.dto.contacto.ContactoTelefonicoDto;
import com.cm.restaurant_server.business.domain.entity.ContactoTelefonico;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ContactoTelefonicoMapper extends BaseMapper<ContactoTelefonico, ContactoTelefonicoDto, ContactoTelefonicoCreateDto, ContactoTelefonicoCreateDto> {

    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "eliminado", ignore = true)
    ContactoTelefonico toEntityCreate(ContactoTelefonicoCreateDto dto);

    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "eliminado", ignore = true)
    ContactoTelefonico toUpdate(@MappingTarget ContactoTelefonico entity, ContactoTelefonicoCreateDto dto);

    @Override
    @Mapping(target = "personaId", ignore = true)
    ContactoTelefonicoDto toDTO(ContactoTelefonico entity);
}
