package com.cm.restaurant_server.business.mapper;


import com.cm.restaurant_server.business.domain.dto.usuario.UsuarioCreateDto;
import com.cm.restaurant_server.business.domain.dto.usuario.UsuarioDto;
import com.cm.restaurant_server.business.domain.entity.Usuario;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UsuarioMapper extends BaseMapper<Usuario, UsuarioDto, UsuarioCreateDto, UsuarioCreateDto> {
}
