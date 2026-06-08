package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.detallecomanda.DetalleComandaCreateDto;
import com.cm.restaurant_server.business.domain.dto.detallecomanda.DetalleComandaDto;
import com.cm.restaurant_server.business.domain.entity.DetalleComanda;
import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCarta;
import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCartaArticuloIndividual;
import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCartaMenu;
import com.cm.restaurant_server.business.domain.entity.DetalleMenu;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public abstract class DetalleComandaMapper implements
        BaseMapper<DetalleComanda, DetalleComandaDto, DetalleComandaCreateDto, DetalleComandaCreateDto> {

    @Override
    @Mapping(target = "comanda", ignore = true)
    @Mapping(target = "detalleSeccionCarta", ignore = true)
    public abstract DetalleComanda toEntityCreate(DetalleComandaCreateDto dto);

    @Override
    @Mapping(target = "comanda", ignore = true)
    @Mapping(target = "detalleSeccionCarta", ignore = true)
    public abstract DetalleComanda toUpdate(@MappingTarget DetalleComanda entity, DetalleComandaCreateDto dto);

    @Override
    @Mapping(target = "comandaId", source = "comanda.id")
    @Mapping(target = "detalleSeccionCartaId", source = "detalleSeccionCarta.id")
    @Mapping(target = "nombre", ignore = true)
    @Mapping(target = "precio", ignore = true)
    public abstract DetalleComandaDto toDTO(DetalleComanda entity);

    /**
     * DetalleSeccionCarta es una jerarquía polimórfica (ArticuloIndividual / Menu)
     * sin nombre/precio propios: cada variante los expone a través de su artículo
     * o su menú. Resolvemos el subtipo en tiempo de ejecución para que el mozo
     * pueda ver "qué pidió" y "a qué precio" sin una llamada adicional.
     */
    @AfterMapping
    protected void mapearNombreYPrecio(DetalleComanda entity, @MappingTarget DetalleComandaDto dto) {
        DetalleSeccionCarta detalle = entity.getDetalleSeccionCarta();
        if (detalle instanceof DetalleSeccionCartaArticuloIndividual articulo) {
            dto.setNombre(articulo.getArticulo() != null ? articulo.getArticulo().getNombre() : null);
            dto.setDescripcion(articulo.getDescripcion());
            dto.setPrecio(articulo.getPrecio());
        } else if (detalle instanceof DetalleSeccionCartaMenu menu) {
            dto.setNombre(menu.getMenu() != null ? menu.getMenu().getNombre() : null);
            dto.setDescripcion(menu.getMenu() != null ? menu.getMenu().getDescripcion() : null);
            dto.setPrecio(menu.getMenu() != null ? menu.getMenu().getPrecio() : 0);
            if (menu.getMenu() != null && menu.getMenu().getDetallesMenu() != null) {
                List<String> componentes = menu.getMenu().getDetallesMenu().stream()
                        .map(dm -> {
                            String nombre = dm.getArticulo() != null
                                    ? dm.getArticulo().getNombre()
                                    : dm.getNombre();
                            return dm.getCantidad() + "× " + nombre;
                        })
                        .collect(Collectors.toList());
                dto.setComponentes(componentes);
            }
        }
    }
}
