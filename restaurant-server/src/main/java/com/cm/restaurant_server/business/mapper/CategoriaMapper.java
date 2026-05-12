package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.categoria.CategoriaCreateDto;
import com.cm.restaurant_server.business.domain.dto.categoria.CategoriaDto;
import com.cm.restaurant_server.business.domain.entity.Categoria;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoriaMapper extends BaseMapper<Categoria, CategoriaDto, CategoriaCreateDto, CategoriaCreateDto> {
}
