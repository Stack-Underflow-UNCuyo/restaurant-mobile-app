package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.factura.FacturaCreateDto;
import com.cm.restaurant_server.business.domain.dto.factura.FacturaDto;
import com.cm.restaurant_server.business.domain.entity.Factura;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface FacturaMapper extends BaseMapper<Factura, FacturaDto, FacturaCreateDto, FacturaCreateDto> {

    @Override
    @Mapping(target = "formaDePago", ignore = true)
    @Mapping(target = "promocion", ignore = true)
    @Mapping(target = "empresa", ignore = true)
    Factura toEntityCreate(FacturaCreateDto dto);

    @Override
    @Mapping(target = "formaDePago", ignore = true)
    @Mapping(target = "promocion", ignore = true)
    @Mapping(target = "empresa", ignore = true)
    Factura toUpdate(@MappingTarget Factura entity, FacturaCreateDto dto);
}
