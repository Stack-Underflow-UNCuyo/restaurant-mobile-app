package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Resenia;
import com.cm.restaurant_server.business.repository.ReseniaRepository;
import jakarta.transaction.Transactional;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReseniaService extends BaseService<Resenia> {
    private final ReseniaRepository reseniaRepository;

    @Autowired
    public ReseniaService(ReseniaRepository repository) {
        super(repository);
        this.reseniaRepository = repository;
    }

    @Override
    protected void validar(Resenia entity, CasoValidar caso) throws Exception {

    }

    @Transactional
    public List<Resenia> buscarPorComanda(String comandaId) throws Exception {
        return reseniaRepository.findByComandaIdAndEliminadoFalse(comandaId);
    }
}
