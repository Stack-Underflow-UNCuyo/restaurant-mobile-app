package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.unidaddemedida.UnidadDeMedidaCreateDto;
import com.cm.restaurant_server.business.domain.dto.unidaddemedida.UnidadDeMedidaDto;
import com.cm.restaurant_server.business.domain.entity.UnidadDeMedida;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UnidadDeMedidaMapper extends BaseMapper<UnidadDeMedida, UnidadDeMedidaDto, UnidadDeMedidaCreateDto, UnidadDeMedidaCreateDto> {
}
