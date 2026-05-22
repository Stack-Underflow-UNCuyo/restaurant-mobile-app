package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.stock.StockCreateDto;
import com.cm.restaurant_server.business.domain.dto.stock.StockDto;
import com.cm.restaurant_server.business.domain.entity.Stock;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface StockMapper extends BaseMapper<Stock, StockDto, StockCreateDto, StockCreateDto> {

    @Override
    @Mapping(target = "articulo.id", source = "articuloId")
    Stock toEntityCreate(StockCreateDto dto);

    @Override
    @Mapping(target = "articulo.id", source = "articuloId")
    Stock toUpdate(@MappingTarget Stock entity, StockCreateDto dto);
}
