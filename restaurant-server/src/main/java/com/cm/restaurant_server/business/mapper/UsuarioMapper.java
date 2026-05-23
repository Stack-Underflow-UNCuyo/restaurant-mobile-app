package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.usuario.UsuarioCreateDto;
import com.cm.restaurant_server.business.domain.dto.usuario.UsuarioDto;
import com.cm.restaurant_server.business.domain.entity.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UsuarioMapper extends BaseMapper<Usuario, UsuarioDto, UsuarioCreateDto, UsuarioCreateDto> {

    @Override
    @Mapping(target = "persona.id", source = "personaId")
    Usuario toUpdate(@MappingTarget Usuario entity, UsuarioCreateDto dto);

    @Override
    @Mapping(target = "persona.id", source = "personaId")
    Usuario toEntityCreate(UsuarioCreateDto dto);

    @Override
    @Mapping(target = "personaId", ignore = true)
    UsuarioDto toDTO(Usuario entity);
}
