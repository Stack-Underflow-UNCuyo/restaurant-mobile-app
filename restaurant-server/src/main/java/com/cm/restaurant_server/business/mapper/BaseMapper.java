package com.cm.restaurant_server.business.mapper;

import java.util.List;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.entity.Base;
import org.mapstruct.MappingTarget;

public interface BaseMapper<Entity extends Base, Dto extends BaseDto, CreateDto, UpdateDto> {
  // toDTO(E source): Convierte una entidad en un DTO.
  public Dto toDTO(Entity source);

  // toEntity(D source): Convierte un DTO en una entidad.
  public Entity toEntity(Dto source);

  // toEntityCreate(DC source): Convierte un DTO de creación(createDto) en una
  // entidad.
  public Entity toEntityCreate(CreateDto source);

  // toUpdate(@MappingTarget E entity, DE source): Actualiza una entidad con datos
  // de un DTO.
  // @MappingTarget hace que no se cree un objeto nuevo, solo modifica el existente
  public Entity toUpdate(@MappingTarget Entity entity, UpdateDto source);

  // toDTOsList(List<E> source): Convierte una lista de entidades en una lista de
  // DTOs.
  public List<Dto> toDTOsList(List<Entity> source);
}
