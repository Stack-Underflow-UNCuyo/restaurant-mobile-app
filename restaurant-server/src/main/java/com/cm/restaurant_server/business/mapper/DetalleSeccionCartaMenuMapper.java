package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.detalleseccioncarta.DetalleSeccionCartaMenuCreateDto;
import com.cm.restaurant_server.business.domain.dto.detalleseccioncarta.DetalleSeccionCartaMenuDto;
import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCartaMenu;
import com.cm.restaurant_server.business.domain.entity.Menu;
import com.cm.restaurant_server.business.repository.MenuRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class DetalleSeccionCartaMenuMapper implements
        BaseMapper<DetalleSeccionCartaMenu, DetalleSeccionCartaMenuDto, DetalleSeccionCartaMenuCreateDto, DetalleSeccionCartaMenuCreateDto> {

    @Autowired
    protected MenuRepository menuRepository;

    @Override
    @Mapping(target = "seccionCarta", ignore = true)
    @Mapping(target = "menu", source = "dto.menuId", qualifiedByName = "stringToMenu")
    public abstract DetalleSeccionCartaMenu toEntityCreate(DetalleSeccionCartaMenuCreateDto dto);

    @org.mapstruct.Named("stringToMenu")
    public Menu stringToMenu(String menuId) {
        if (menuId == null || menuId.isEmpty()) {
            return null;
        }
        return menuRepository.findByIdAndEliminadoFalse(menuId).orElse(null);
    }

    @Override
    @Mapping(target = "seccionCarta", ignore = true)
    @Mapping(target = "menu", source = "dto.menuId", qualifiedByName = "stringToMenu")
    public abstract DetalleSeccionCartaMenu toUpdate(@MappingTarget DetalleSeccionCartaMenu entity,
            DetalleSeccionCartaMenuCreateDto dto);
}
