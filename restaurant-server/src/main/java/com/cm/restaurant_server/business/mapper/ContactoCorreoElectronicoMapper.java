package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.contacto.ContactoCorreoElectronicoCreateDto;
import com.cm.restaurant_server.business.domain.dto.contacto.ContactoCorreoElectronicoDto;
import com.cm.restaurant_server.business.domain.entity.ContactoCorreoElectronico;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ContactoCorreoElectronicoMapper extends BaseMapper<ContactoCorreoElectronico, ContactoCorreoElectronicoDto, ContactoCorreoElectronicoCreateDto, ContactoCorreoElectronicoCreateDto> {

    @Override
    ContactoCorreoElectronico toEntityCreate(ContactoCorreoElectronicoCreateDto dto);

    @Override
    ContactoCorreoElectronico toUpdate(@MappingTarget ContactoCorreoElectronico entity, ContactoCorreoElectronicoCreateDto dto);

    @Override
    ContactoCorreoElectronicoDto toDTO(ContactoCorreoElectronico entity);
}
