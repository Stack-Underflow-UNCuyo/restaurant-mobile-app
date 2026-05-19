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
    public FacturaService(FacturaRepository repository, DetalleFacturaService detalleFacturaService) {
        super(repository);
    }

    @Override
    protected void validar(Factura entity, CasoValidar caso) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'validar'");
    }

    public List<Factura> listarFacturaPorEstado(EstadoFactura estado) {
        return this.getRepository().findByEstadoFactura(estado);
    }

    @Transactional
    public List<DetalleFactura> agregarDetalleFactura(DetalleFactura detalle) throws Exception {
        var factura = this.findById(detalle.getFactura().getId());
        factura.getDetalleFacturas().add(detalle);
        return factura.getDetalleFacturas();
    }

    protected FacturaRepository getRepository() {
        return (FacturaRepository) this.baseRepository;
    }

    @Transactional
    public List<DetalleFactura> listarDetalleFactura(String idFactura) throws Exception {
        return this.findById(idFactura).getDetalleFacturas();
    }
}
