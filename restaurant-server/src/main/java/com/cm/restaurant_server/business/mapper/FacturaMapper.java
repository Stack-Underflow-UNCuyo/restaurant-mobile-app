package com.cm.restaurant_server.business.mapper;

import com.cm.restaurant_server.business.domain.dto.factura.FacturaCreateDto;
import com.cm.restaurant_server.business.domain.dto.factura.FacturaDto;
import com.cm.restaurant_server.business.domain.entity.Factura;
import com.cm.restaurant_server.business.domain.entity.FormaDePago;
import com.cm.restaurant_server.business.domain.entity.Promocion;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface FacturaMapper extends BaseMapper<Factura, FacturaDto, FacturaCreateDto, FacturaCreateDto> {

    @Override
    @Mapping(target = "formaDePago", ignore = true)
    @Mapping(target = "promocion", ignore = true)
    @Mapping(target = "detalleFacturas", ignore = true)
    Factura toEntityCreate(FacturaCreateDto dto);

    @Override
    @Mapping(target = "formaDePago", ignore = true)
    @Mapping(target = "promocion", ignore = true)
    @Mapping(target = "detalleFacturas", ignore = true)
    Factura toUpdate(@MappingTarget Factura entity, FacturaCreateDto dto);

    /**
     * Asigna las referencias formaDePago y promocion creando instancias nuevas
     * con solo el id. No se debe escribir sobre el .id de la asociación existente
     * (entidad gestionada): Hibernate lo interpreta como una alteración del
     * identificador y lanza "identifier was altered". Reemplazar la referencia
     * completa solo setea la FK, que es lo único que necesita un @ManyToOne.
     */
    @AfterMapping
    default void asignarReferencias(FacturaCreateDto dto, @MappingTarget Factura factura) {
        if (dto.getFormaDePagoId() == null || dto.getFormaDePagoId().isBlank()) {
            factura.setFormaDePago(null);
        } else {
            FormaDePago formaDePago = new FormaDePago();
            formaDePago.setId(dto.getFormaDePagoId());
            factura.setFormaDePago(formaDePago);
        }
        if (dto.getPromocionId() == null || dto.getPromocionId().isBlank()) {
            factura.setPromocion(null);
        } else {
            Promocion promocion = new Promocion();
            promocion.setId(dto.getPromocionId());
            factura.setPromocion(promocion);
        }
    }
}
