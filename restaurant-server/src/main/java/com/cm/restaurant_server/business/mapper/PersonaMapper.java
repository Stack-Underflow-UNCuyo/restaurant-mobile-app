package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.persona.PersonaCreateDto;
import com.cm.restaurant_server.business.domain.dto.persona.PersonaDto;
import com.cm.restaurant_server.business.domain.entity.ContactoCorreoElectronico;
import com.cm.restaurant_server.business.domain.entity.ContactoTelefonico;
import com.cm.restaurant_server.business.domain.entity.Persona;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

@Mapper(componentModel = "spring", uses = ContactoMapper.class)
public interface PersonaMapper extends BaseMapper<Persona, PersonaDto, PersonaCreateDto, PersonaCreateDto> {

    @Override
    @Mapping(target = "direccion.id", source = "direccionId")
    @Mapping(target = "contactosCorreosElectronicos", source = "contactoCorreoElectronicoIds", qualifiedByName = "mapCorreosIds")
    @Mapping(target = "contactosTelefonicos", source = "contactoTelefonicoIds", qualifiedByName = "mapTelefonosIds")
    Persona toEntity(PersonaDto dto);

    @Override
    @Mapping(target = "direccion.id", source = "direccionId")
    @Mapping(target = "contactosCorreosElectronicos", source = "contactoCorreoElectronicoIds", qualifiedByName = "mapCorreosIds")
    @Mapping(target = "contactosTelefonicos", source = "contactoTelefonicoIds", qualifiedByName = "mapTelefonosIds")
    Persona toEntityCreate(PersonaCreateDto dto);

    @Override
    @Mapping(target = "direccion.id", source = "direccionId")
    @Mapping(target = "contactosCorreosElectronicos", source = "contactoCorreoElectronicoIds", qualifiedByName = "mapCorreosIds")
    @Mapping(target = "contactosTelefonicos", source = "contactoTelefonicoIds", qualifiedByName = "mapTelefonosIds")
    Persona toUpdate(@MappingTarget Persona entity, PersonaCreateDto dto);


    @Named("mapCorreosIds")
    default List<ContactoCorreoElectronico> mapCorreosIds(List<String> correosIds) {
        if (correosIds == null || correosIds.isEmpty()) return new ArrayList<>();
        return correosIds.stream().map(id -> {
            ContactoCorreoElectronico correo = new ContactoCorreoElectronico();
            correo.setId(id); 
            return correo;
        }).collect(Collectors.toList());
    }

    @Named("mapTelefonosIds")
    default List<ContactoTelefonico> mapTelefonosIds(List<String> telefonosIds) {
        if (telefonosIds == null || telefonosIds.isEmpty()) return new ArrayList<>();
        return telefonosIds.stream().map(id -> {
            ContactoTelefonico telefono = new ContactoTelefonico();
            telefono.setId(id);
            return telefono;
        }).collect(Collectors.toList());
    }

}
