package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.detalleseccioncarta.DetalleSeccionCartaDto;
import com.cm.restaurant_server.business.domain.dto.seccioncarta.SeccionCartaCreateDto;
import com.cm.restaurant_server.business.domain.dto.seccioncarta.SeccionCartaDto;
import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCarta;
import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCartaArticuloIndividual;
import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCartaMenu;
import com.cm.restaurant_server.business.domain.entity.SeccionCarta;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public abstract class SeccionCartaMapper
        implements BaseMapper<SeccionCarta, SeccionCartaDto, SeccionCartaCreateDto, SeccionCartaCreateDto> {

    @Autowired
    protected DetalleSeccionCartaArticuloIndividualMapper detalleArticuloIndividualMapper;

    @Autowired
    protected DetalleSeccionCartaMenuMapper detalleMenuMapper;

    @Override
    @Mapping(target = "imagenUrl", source = "imagen.url")
    @Mapping(target = "imagenNombre", source = "imagen.nombre")
    @Mapping(target = "detallesSeccionCarta", ignore = true)
    public abstract SeccionCartaDto toDTO(SeccionCarta entity);

    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "eliminado", ignore = true)
    @Mapping(target = "categoria", ignore = true)
    @Mapping(target = "imagen", ignore = true)
    @Mapping(target = "detallesSeccionCarta", ignore = true)
    public abstract SeccionCarta toEntityCreate(SeccionCartaCreateDto dto);

    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "eliminado", ignore = true)
    @Mapping(target = "categoria", ignore = true)
    @Mapping(target = "imagen", ignore = true)
    @Mapping(target = "detallesSeccionCarta", ignore = true)
    public abstract SeccionCarta toUpdate(@MappingTarget SeccionCarta entity, SeccionCartaCreateDto dto);

    /**
     * MapStruct no puede generar el mapeo de detallesSeccionCarta automáticamente:
     * DetalleSeccionCarta es una jerarquía polimórfica (ArticuloIndividual / Menu)
     * y no existe un mapper que reciba el tipo base. Se resuelve el subtipo en
     * tiempo de ejecución y se delega al mapper concreto correspondiente, para que
     * el JSON conserve los campos propios de cada variante (precio/articulo o menu).
     */
    @AfterMapping
    protected void mapearDetalles(SeccionCarta entity, @MappingTarget SeccionCartaDto dto) {
        List<DetalleSeccionCarta> detalles = entity.getDetallesSeccionCarta();
        if (detalles == null) {
            dto.setDetallesSeccionCarta(new ArrayList<>());
            return;
        }
        dto.setDetallesSeccionCarta(detalles.stream().map(this::mapearDetalle).collect(Collectors.toList()));
    }

    private DetalleSeccionCartaDto mapearDetalle(DetalleSeccionCarta detalle) {
        if (detalle instanceof DetalleSeccionCartaArticuloIndividual articuloIndividual) {
            return detalleArticuloIndividualMapper.toDTO(articuloIndividual);
        }
        if (detalle instanceof DetalleSeccionCartaMenu menu) {
            return detalleMenuMapper.toDTO(menu);
        }
        return null;
    }
}
