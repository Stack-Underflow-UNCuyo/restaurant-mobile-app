package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.contacto.ContactoCorreoElectronicoDto;
import com.cm.restaurant_server.business.domain.dto.contacto.ContactoDto;
import com.cm.restaurant_server.business.domain.dto.contacto.ContactoTelefonicoDto;
import com.cm.restaurant_server.business.domain.entity.Contacto;
import com.cm.restaurant_server.business.domain.entity.ContactoCorreoElectronico;
import com.cm.restaurant_server.business.domain.entity.ContactoTelefonico;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.SubclassMapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ContactoTelefonicoMapper.class, ContactoCorreoElectronicoMapper.class})
public interface ContactoMapper {

    @SubclassMapping(source = ContactoTelefonico.class, target = ContactoTelefonicoDto.class)
    @SubclassMapping(source = ContactoCorreoElectronico.class, target = ContactoCorreoElectronicoDto.class)
    @Mapping(target = "personaId", ignore = true)
    ContactoDto toDTO(Contacto entity);

    List<ContactoDto> toDTOsList(List<Contacto> source);
}
