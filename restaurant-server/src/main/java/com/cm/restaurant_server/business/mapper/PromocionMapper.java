package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.promocion.PromocionCreateDto;
import com.cm.restaurant_server.business.domain.dto.promocion.PromocionDto;
import com.cm.restaurant_server.business.domain.entity.Promocion;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PromocionMapper extends BaseMapper<Promocion, PromocionDto, PromocionCreateDto, PromocionCreateDto> {
}
