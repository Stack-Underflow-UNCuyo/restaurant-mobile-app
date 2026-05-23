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
    ContactoTelefonico toEntityCreate(ContactoTelefonicoCreateDto dto);

    @Override
    ContactoTelefonico toUpdate(@MappingTarget ContactoTelefonico entity, ContactoTelefonicoCreateDto dto);

    @Override
    ContactoTelefonicoDto toDTO(ContactoTelefonico entity);
}
