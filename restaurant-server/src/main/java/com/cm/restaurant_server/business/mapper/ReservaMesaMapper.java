package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.reservamensa.ReservaMesaCreateDto;
import com.cm.restaurant_server.business.domain.dto.reservamensa.ReservaMesaDto;
import com.cm.restaurant_server.business.domain.entity.ReservaMesa;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ReservaMesaMapper
        extends BaseMapper<ReservaMesa, ReservaMesaDto, ReservaMesaCreateDto, ReservaMesaCreateDto> {

    @Override
    @Mapping(target = "mesaRestaurante", ignore = true)
    ReservaMesa toEntityCreate(ReservaMesaCreateDto dto);

    @Override
    @Mapping(target = "mesaRestaurante", ignore = true)
    ReservaMesa toUpdate(@MappingTarget ReservaMesa entity, ReservaMesaCreateDto dto);
}
