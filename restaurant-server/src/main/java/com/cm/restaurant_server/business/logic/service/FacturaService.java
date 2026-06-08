package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.dto.factura.FacturaPreviewDto;
import com.cm.restaurant_server.business.domain.dto.factura.GenerarFacturaDto;
import com.cm.restaurant_server.business.domain.dto.factura.LineaFacturaPreviewDto;
import com.cm.restaurant_server.business.domain.entity.DetalleComanda;
import com.cm.restaurant_server.business.domain.entity.DetalleFactura;
import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCarta;
import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCartaArticuloIndividual;
import com.cm.restaurant_server.business.domain.entity.DetalleSeccionCartaMenu;
import com.cm.restaurant_server.business.domain.entity.Factura;
import com.cm.restaurant_server.business.domain.entity.FormaDePago;
import com.cm.restaurant_server.business.domain.entity.Promocion;
import com.cm.restaurant_server.business.domain.enumeration.EstadoFactura;
import com.cm.restaurant_server.business.repository.FacturaRepository;

import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class FacturaService extends BaseService<Factura> {
    private final DetalleFacturaService detalleFacturaService;
    private final ComandaService comandaService;
    private final DetalleSeccionCartaService detalleSeccionCartaService;
    private final FormaDePagoService formaDePagoService;
    private final PromocionService promocionService;

    public FacturaService(FacturaRepository repository, DetalleFacturaService detalleFacturaService,
            ComandaService comandaService, DetalleSeccionCartaService detalleSeccionCartaService,
            FormaDePagoService formaDePagoService, PromocionService promocionService) {
        super(repository);
        this.detalleFacturaService = detalleFacturaService;
        this.comandaService = comandaService;
        this.detalleSeccionCartaService = detalleSeccionCartaService;
        this.formaDePagoService = formaDePagoService;
        this.promocionService = promocionService;
    }

    @Override
    protected void validar(Factura entity, CasoValidar caso) throws Exception {

    }

    public List<Factura> listarFacturaPorEstado(EstadoFactura estado) {
        return this.getRepository().findByEstado(estado);
    }

    @Transactional
    public List<DetalleFactura> agregarDetalleFactura(DetalleFactura detalle) throws Exception {
        var factura = this.findById(detalle.getFactura().getId());
        factura.getDetalleFacturas().add(detalle);
        return factura.getDetalleFacturas();
    }

    /**
     * Asigna a la factura los detalles indicados
     * se setea la factura en cada detalle y se guarda.
     */
    @Transactional
    public void asignarDetalles(String facturaId, List<String> detalleIds) throws Exception {
        if (detalleIds == null) {
            return;
        }
        Factura factura = this.findById(facturaId);
        for (String detalleId : detalleIds) {
            DetalleFactura detalle = this.detalleFacturaService.findById(detalleId);
            detalle.setFactura(factura);
            this.detalleFacturaService.save(detalle);
        }
    }


    //Reemplaza los detalles asignados a la factura por otros
    @Transactional
    public void reasignarDetalles(String facturaId, List<String> detalleIds) throws Exception {
        for (DetalleFactura detalle : this.detalleFacturaService.listarPorFactura(facturaId)) {
            detalle.setFactura(null);
            this.detalleFacturaService.save(detalle);
        }
        this.asignarDetalles(facturaId, detalleIds);
    }

    protected FacturaRepository getRepository() {
        return (FacturaRepository) this.baseRepository;
    }

    @Transactional
    public List<DetalleFactura> listarDetalleFactura(String idFactura) throws Exception {
        return this.findById(idFactura).getDetalleFacturas();
    }

    // ---- Generación de factura a partir de una comanda ----

    /**
     * Calcula (sin persistir) las líneas y el subtotal de facturar una comanda.
     * El descuento/total definitivos los calcula la generación según la promoción
     * elegida; acá el front muestra el subtotal y aplica el % en vivo.
     */
    public FacturaPreviewDto previewDesdeComanda(String comandaId) throws Exception {
        List<LineaFacturaPreviewDto> lineas = construirLineas(comandaId);
        double subtotalGeneral = lineas.stream().mapToDouble(LineaFacturaPreviewDto::getSubtotal).sum();
        boolean yaFacturada = detalleFacturaService.comandaYaFacturada(comandaId);
        return new FacturaPreviewDto(lineas, subtotalGeneral, 0.0, subtotalGeneral, yaFacturada);
    }

    @Transactional
    public Factura generarDesdeComanda(GenerarFacturaDto dto) throws Exception {
        if (detalleFacturaService.comandaYaFacturada(dto.getComandaId())) {
            throw new Exception("La comanda ya tiene una factura");
        }
        List<DetalleComanda> detallesComanda = comandaService.listarDetalleComanda(dto.getComandaId());
        if (detallesComanda.isEmpty()) {
            throw new Exception("La comanda no tiene detalles para facturar");
        }

        Promocion promocion = null;
        double porcentaje = 0;
        if (dto.getPromocionId() != null && !dto.getPromocionId().isBlank()) {
            promocion = promocionService.findById(dto.getPromocionId());
            porcentaje = promocion.getPorcentajeDescuento();
        }
        FormaDePago formaDePago = null;
        if (dto.getFormaDePagoId() != null && !dto.getFormaDePagoId().isBlank()) {
            formaDePago = formaDePagoService.findById(dto.getFormaDePagoId());
        }

        Factura factura = new Factura();
        factura.setNumeroFactura(siguienteNumero());
        factura.setFechaFactura(dto.getFechaFactura());
        factura.setEstado(dto.getEstado());
        factura.setFormaDePago(formaDePago);
        factura.setPromocion(promocion);
        factura.setTotalPagado(0);
        Factura guardada = this.save(factura);

        double subtotalGeneral = 0;
        for (DetalleComanda dc : detallesComanda) {
            DetalleSeccionCarta dsc = detalleSeccionCartaService
                    .buscarDetalleSeccionCarta(dc.getDetalleSeccionCarta().getId());
            double subtotal = obtenerPrecio(dsc) * dc.getCantidad();
            subtotalGeneral += subtotal;

            DetalleFactura df = new DetalleFactura();
            df.setCantidad(dc.getCantidad());
            df.setSubtotal(subtotal);
            df.setDetalleComanda(dc);
            df.setFactura(guardada);
            detalleFacturaService.save(df);
        }

        double total = subtotalGeneral - (subtotalGeneral * porcentaje / 100.0);
        guardada.setTotalPagado(total);
        return this.update(guardada.getId(), guardada);
    }

    private List<LineaFacturaPreviewDto> construirLineas(String comandaId) throws Exception {
        List<DetalleComanda> detalles = comandaService.listarDetalleComanda(comandaId);
        List<LineaFacturaPreviewDto> lineas = new ArrayList<>();
        for (DetalleComanda dc : detalles) {
            DetalleSeccionCarta dsc = detalleSeccionCartaService
                    .buscarDetalleSeccionCarta(dc.getDetalleSeccionCarta().getId());
            double precio = obtenerPrecio(dsc);
            lineas.add(new LineaFacturaPreviewDto(
                    dc.getId(), obtenerNombre(dsc), dc.getCantidad(), precio, precio * dc.getCantidad()));
        }
        return lineas;
    }

    // El precio es polimórfico: artículo individual lo tiene propio; el menú lo toma del Menu.
    private double obtenerPrecio(DetalleSeccionCarta dsc) {
        if (dsc instanceof DetalleSeccionCartaArticuloIndividual articulo) {
            return articulo.getPrecio();
        }
        if (dsc instanceof DetalleSeccionCartaMenu menu) {
            return menu.getMenu() != null ? menu.getMenu().getPrecio() : 0;
        }
        return 0;
    }

    private String obtenerNombre(DetalleSeccionCarta dsc) {
        if (dsc instanceof DetalleSeccionCartaArticuloIndividual articulo) {
            if (articulo.getDescripcion() != null && !articulo.getDescripcion().isBlank()) {
                return articulo.getDescripcion();
            }
            return articulo.getArticulo() != null ? articulo.getArticulo().getNombre() : "Artículo";
        }
        if (dsc instanceof DetalleSeccionCartaMenu menu) {
            return menu.getMenu() != null ? menu.getMenu().getNombre() : "Menú";
        }
        return "Ítem";
    }

    private long siguienteNumero() {
        Factura ultima = getRepository().findTopByEliminadoFalseOrderByNumeroFacturaDesc();
        long max = (ultima != null && ultima.getNumeroFactura() != null) ? ultima.getNumeroFactura() : 0L;
        return max + 1;
    }
}
