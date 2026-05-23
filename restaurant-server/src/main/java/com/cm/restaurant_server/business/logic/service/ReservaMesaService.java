package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.ReservaMesa;
import com.cm.restaurant_server.business.repository.ReservaMesaRepository;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class ReservaMesaService extends BaseService<ReservaMesa> {
    public ReservaMesaService(ReservaMesaRepository repository) {
        super(repository);
    }

    @Override
    protected void validar(ReservaMesa entity, CasoValidar caso) throws Exception {

    }

    public List<ReservaMesa> buscarReservaMesaPorCliente(String nombreApellidoCliente) {
        return this.getRepository().findByNombreApellidoClienteContainingIgnoreCase(nombreApellidoCliente.trim());
    }

    protected ReservaMesaRepository getRepository() {
        return (ReservaMesaRepository) this.baseRepository;
    }
}
