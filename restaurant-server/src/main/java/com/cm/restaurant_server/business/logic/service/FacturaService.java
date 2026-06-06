package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.DetalleFactura;
import com.cm.restaurant_server.business.domain.entity.Factura;
import com.cm.restaurant_server.business.domain.enumeration.EstadoFactura;
import com.cm.restaurant_server.business.repository.FacturaRepository;

import jakarta.transaction.Transactional;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class FacturaService extends BaseService<Factura> {
    private final DetalleFacturaService detalleFacturaService;

    public FacturaService(FacturaRepository repository, DetalleFacturaService detalleFacturaService) {
        super(repository);
        this.detalleFacturaService = detalleFacturaService;
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
}
