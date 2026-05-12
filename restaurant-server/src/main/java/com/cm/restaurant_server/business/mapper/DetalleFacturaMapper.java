package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.detallefactura.DetalleFacturaCreateDto;
import com.cm.restaurant_server.business.domain.dto.detallefactura.DetalleFacturaDto;
import com.cm.restaurant_server.business.domain.entity.DetalleFactura;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DetalleFacturaMapper extends BaseMapper<DetalleFactura, DetalleFacturaDto, DetalleFacturaCreateDto, DetalleFacturaCreateDto> {

    @Override
    @Mapping(target = "factura", ignore = true)
    @Mapping(target = "detalleComanda", ignore = true)
    DetalleFactura toEntityCreate(DetalleFacturaCreateDto dto);

    @Override
    @Mapping(target = "factura", ignore = true)
    @Mapping(target = "detalleComanda", ignore = true)
    DetalleFactura toUpdate(@MappingTarget DetalleFactura entity, DetalleFacturaCreateDto dto);
}
