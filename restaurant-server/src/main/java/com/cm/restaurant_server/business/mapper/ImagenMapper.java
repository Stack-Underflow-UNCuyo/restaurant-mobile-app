package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.imagen.ImagenCreateDto;
import com.cm.restaurant_server.business.domain.dto.imagen.ImagenDto;
import com.cm.restaurant_server.business.domain.entity.Imagen;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ImagenMapper extends BaseMapper<Imagen, ImagenDto, ImagenCreateDto, ImagenCreateDto> {
}
