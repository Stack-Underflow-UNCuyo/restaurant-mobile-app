package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.reservamensa.ReservaMensaCreateDto;
import com.cm.restaurant_server.business.domain.dto.reservamensa.ReservaMensaDto;
import com.cm.restaurant_server.business.domain.entity.ReservaMensa;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ReservaMensaMapper extends BaseMapper<ReservaMensa, ReservaMensaDto, ReservaMensaCreateDto, ReservaMensaCreateDto> {

    @Override
    @Mapping(target = "mesaRestaurante", ignore = true)
    ReservaMensa toEntityCreate(ReservaMensaCreateDto dto);

    @Override
    @Mapping(target = "mesaRestaurante", ignore = true)
    ReservaMensa toUpdate(@MappingTarget ReservaMensa entity, ReservaMensaCreateDto dto);
}
