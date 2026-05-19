package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.comanda.ComandaRestaurantCreateDto;
import com.cm.restaurant_server.business.domain.dto.comanda.ComandaRestaurantDto;
import com.cm.restaurant_server.business.domain.entity.ComandaRestaurant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = { EmpleadoMapper.class, ContactoMapper.class })
public interface ComandaRestaurantMapper extends
        BaseMapper<ComandaRestaurant, ComandaRestaurantDto, ComandaRestaurantCreateDto, ComandaRestaurantCreateDto> {

    @Override
    @Mapping(target = "cliente", ignore = true)
    @Mapping(target = "empleado", ignore = true)
    ComandaRestaurant toEntity(ComandaRestaurantDto dto);

    @Override
    @Mapping(target = "cliente", ignore = true)
    @Mapping(target = "empleado", ignore = true)
    ComandaRestaurant toEntityCreate(ComandaRestaurantCreateDto dto);

    @Override
    @Mapping(target = "cliente", ignore = true)
    @Mapping(target = "empleado", ignore = true)
    ComandaRestaurant toUpdate(@MappingTarget ComandaRestaurant entity, ComandaRestaurantCreateDto dto);

    @Override
    @Mapping(target = "clienteId", source = "cliente.id")
    ComandaRestaurantDto toDTO(ComandaRestaurant entity);
}
