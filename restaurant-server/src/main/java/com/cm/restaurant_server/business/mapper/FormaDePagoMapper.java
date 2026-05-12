package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.formadepago.FormaDePagoCreateDto;
import com.cm.restaurant_server.business.domain.dto.formadepago.FormaDePagoDto;
import com.cm.restaurant_server.business.domain.entity.FormaDePago;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FormaDePagoMapper extends BaseMapper<FormaDePago, FormaDePagoDto, FormaDePagoCreateDto, FormaDePagoCreateDto> {
}
