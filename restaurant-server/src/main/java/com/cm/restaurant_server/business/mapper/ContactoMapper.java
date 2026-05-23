package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.contacto.ContactoDto;
import com.cm.restaurant_server.business.domain.entity.Contacto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ContactoMapper {

    ContactoDto toDTO(Contacto entity);

    List<ContactoDto> toDTOsList(List<Contacto> source);
}
