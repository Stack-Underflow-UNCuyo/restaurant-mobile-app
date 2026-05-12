package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.movimientostock.MovimientoStockCreateDto;
import com.cm.restaurant_server.business.domain.dto.movimientostock.MovimientoStockDto;
import com.cm.restaurant_server.business.domain.entity.MovimientoStock;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MovimientoStockMapper extends BaseMapper<MovimientoStock, MovimientoStockDto, MovimientoStockCreateDto, MovimientoStockCreateDto> {

    @Override
    @Mapping(target = "stock", ignore = true)
    MovimientoStock toEntityCreate(MovimientoStockCreateDto dto);

    @Override
    @Mapping(target = "stock", ignore = true)
    MovimientoStock toUpdate(@MappingTarget MovimientoStock entity, MovimientoStockCreateDto dto);
}
