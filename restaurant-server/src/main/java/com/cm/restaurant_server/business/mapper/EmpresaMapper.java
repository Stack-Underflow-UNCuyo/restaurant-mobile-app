package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.contacto.ContactoCorreoElectronicoDto;
import com.cm.restaurant_server.business.domain.dto.contacto.ContactoDto;
import com.cm.restaurant_server.business.domain.dto.contacto.ContactoTelefonicoDto;
import com.cm.restaurant_server.business.domain.dto.empresa.EmpresaCreateDto;
import com.cm.restaurant_server.business.domain.dto.empresa.EmpresaDto;
import com.cm.restaurant_server.business.domain.entity.Contacto;
import com.cm.restaurant_server.business.domain.entity.ContactoCorreoElectronico;
import com.cm.restaurant_server.business.domain.entity.ContactoTelefonico;
import com.cm.restaurant_server.business.domain.entity.Empresa;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring", uses = {DireccionMapper.class})
public interface EmpresaMapper extends BaseMapper<Empresa, EmpresaDto, EmpresaCreateDto, EmpresaCreateDto> {

    @Override
    @Mapping(target = "telefono", ignore = true)
    @Mapping(target = "correoElectronico", ignore = true)
    @Mapping(target = "contactos", qualifiedByName = "contactosToDto")
    EmpresaDto toDTO(Empresa empresa);

    @Named("contactosToDto")
    default ContactoDto[] contactosToDto(List<Contacto> contactos) {
        if (contactos == null) return new ContactoDto[0];
        return contactos.stream().map(c -> {
            if (c instanceof ContactoTelefonico t) {
                ContactoTelefonicoDto dto = new ContactoTelefonicoDto();
                dto.setId(t.getId());
                dto.setTipoContacto(t.getTipoContacto());
                dto.setObservacion(t.getObservacion());
                dto.setTelefono(t.getTelefono());
                dto.setTipoTelefono(t.getTipoTelefono());
                return (ContactoDto) dto;
            } else if (c instanceof ContactoCorreoElectronico e) {
                ContactoCorreoElectronicoDto dto = new ContactoCorreoElectronicoDto();
                dto.setId(e.getId());
                dto.setTipoContacto(e.getTipoContacto());
                dto.setObservacion(e.getObservacion());
                dto.setEmail(e.getEmail());
                return (ContactoDto) dto;
            }
            ContactoDto dto = new ContactoDto();
            dto.setId(c.getId());
            dto.setTipoContacto(c.getTipoContacto());
            dto.setObservacion(c.getObservacion());
            return dto;
        }).toArray(ContactoDto[]::new);
    }

    @Override
    @Mapping(target = "direccion", ignore = true)
    @Mapping(target = "contactos", ignore = true)
    @Mapping(target = "eliminado", ignore = true)
    Empresa toEntity(EmpresaDto source);

    @Override
    @Mapping(target = "direccion.id", source = "direccionId")
    @Mapping(target = "contactos", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "eliminado", ignore = true)
    Empresa toEntityCreate(EmpresaCreateDto dto);

    @Override
    @Mapping(target = "direccion.id", source = "direccionId")
    @Mapping(target = "contactos", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "eliminado", ignore = true)
    Empresa toUpdate(@MappingTarget Empresa entity, EmpresaCreateDto dto);
}
