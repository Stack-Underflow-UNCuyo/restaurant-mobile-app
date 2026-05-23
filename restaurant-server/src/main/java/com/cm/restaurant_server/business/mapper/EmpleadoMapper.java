package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.empleado.EmpleadoCreateDto;
import com.cm.restaurant_server.business.domain.dto.empleado.EmpleadoDto;
import com.cm.restaurant_server.business.domain.entity.ContactoCorreoElectronico;
import com.cm.restaurant_server.business.domain.entity.ContactoTelefonico;
import com.cm.restaurant_server.business.domain.entity.Direccion;
import com.cm.restaurant_server.business.domain.entity.Empleado;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

@Mapper(componentModel = "spring", uses = ContactoMapper.class)
public interface EmpleadoMapper extends BaseMapper<Empleado, EmpleadoDto, EmpleadoCreateDto, EmpleadoCreateDto> {

    @Override
    @Mapping(target = "direccion.id", source = "direccionId")
    @Mapping(target = "contactosCorreosElectronicos", source = "contactoCorreoElectronicoIds", qualifiedByName = "mapCorreosIds")
    @Mapping(target = "contactosTelefonicos", source = "contactoTelefonicoIds", qualifiedByName = "mapTelefonosIds")
    Empleado toEntity(EmpleadoDto dto);

    @Override
    @Mapping(target = "direccion.id", source = "direccionId")
    @Mapping(target = "contactosCorreosElectronicos", source = "contactoCorreoElectronicoIds", qualifiedByName = "mapCorreosIds")
    @Mapping(target = "contactosTelefonicos", source = "contactoTelefonicoIds", qualifiedByName = "mapTelefonosIds")
    Empleado toEntityCreate(EmpleadoCreateDto dto);

    @Override
    @Mapping(target = "direccion.id", source = "direccionId")
    @Mapping(target = "contactosCorreosElectronicos", source = "contactoCorreoElectronicoIds", qualifiedByName = "mapCorreosIds")
    @Mapping(target = "contactosTelefonicos", source = "contactoTelefonicoIds", qualifiedByName = "mapTelefonosIds")
    Empleado toUpdate(@MappingTarget Empleado entity, EmpleadoCreateDto dto);

    /*@Named("mapDireccionId")
    default Direccion mapDireccionId(String direccionId) {
        if (direccionId == null) return null;
        Direccion direccion = new Direccion();
        direccion.setId(direccionId); 
        return direccion;
    }
        */

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
