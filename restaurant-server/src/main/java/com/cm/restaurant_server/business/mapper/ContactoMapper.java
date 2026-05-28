package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.contacto.ContactoCorreoElectronicoDto;
import com.cm.restaurant_server.business.domain.dto.contacto.ContactoDto;
import com.cm.restaurant_server.business.domain.dto.contacto.ContactoTelefonicoDto;
import com.cm.restaurant_server.business.domain.entity.Contacto;
import com.cm.restaurant_server.business.domain.entity.ContactoCorreoElectronico;
import com.cm.restaurant_server.business.domain.entity.ContactoTelefonico;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ContactoMapper {

    ContactoDto toDTO(Contacto entity);

    List<ContactoDto> toDTOsList(List<Contacto> source);

    @Mapping(target = "personaId", ignore = true)
    ContactoCorreoElectronicoDto toCorreoDto(ContactoCorreoElectronico entity);

    @Mapping(target = "personaId", ignore = true)
    ContactoTelefonicoDto toTelefonoDto(ContactoTelefonico entity);

    List<ContactoCorreoElectronicoDto> toCorreoDtosList(List<ContactoCorreoElectronico> source);

    List<ContactoTelefonicoDto> toTelefonoDtosList(List<ContactoTelefonico> source);
}
