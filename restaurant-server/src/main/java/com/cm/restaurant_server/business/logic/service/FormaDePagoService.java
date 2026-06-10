package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.FormaDePago;
import com.cm.restaurant_server.business.domain.enumeration.TipoPago;
import com.cm.restaurant_server.business.repository.FormaDePagoRepository;

import org.springframework.stereotype.Service;

@Service
public class FormaDePagoService extends BaseService<FormaDePago> {
    private final FormaDePagoRepository repository;

    public FormaDePagoService(FormaDePagoRepository repository) {
        super(repository);
        this.repository = repository;
    }

    @Override
    protected void validar(FormaDePago entity, CasoValidar caso) throws Exception {

    }

    /** Busca la forma de pago por su tipo (ej. EFECTIVO, TRANSFERENCIA). */
    public FormaDePago buscarPorTipoPago(TipoPago tipoPago) throws Exception {
        return repository.findByTipoPagoAndEliminadoFalse(tipoPago)
                .orElseThrow(() -> new Exception("No existe forma de pago para el tipo: " + tipoPago));
    }
}
