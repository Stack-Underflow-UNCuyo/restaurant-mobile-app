package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Departamento;
import com.cm.restaurant_server.business.logic.error.ErrorServiceException;
import com.cm.restaurant_server.business.repository.DepartamentoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DepartamentoService extends BaseService<Departamento> {

    private final DepartamentoRepository departamentoRepository;

    @Autowired
    public DepartamentoService(DepartamentoRepository repository) {
        super(repository);
        this.departamentoRepository = repository;
    }

    @Transactional
    public Departamento findByName(String name) throws Exception {
        try {
            Optional<Departamento> entityOptional = departamentoRepository.findByNombreAndEliminadoFalse(name);
            return entityOptional.orElseThrow(() -> new Exception("Entity not found or marked as deleted"));
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    protected void validar(Departamento entity, String caso) throws ErrorServiceException {
        try {
            if (entity.getNombre() == null || entity.getNombre().isEmpty()) {
                throw new ErrorServiceException("Debe indicar el nombre");
            }
            switch (caso) {
                case "SAVE": {
                    if (departamentoRepository.existsByNombreAndEliminadoFalse(entity.getNombre())) {
                        throw new ErrorServiceException("El departamento " + entity.getNombre() + " ya existe en el sistema");
                    }
                    break;
                }
                case "UPDATE": {
                    Optional<Departamento> departamentoOptional = departamentoRepository.findByNombreAndEliminadoFalse(entity.getNombre());
                    if (departamentoOptional.isPresent()) {
                        Departamento departamento = departamentoOptional.get();
                        if (!departamento.getId().equals(entity.getId())) {
                            throw new ErrorServiceException("El departamento " + entity.getNombre() + " ya existe en el sistema");
                        }
                    }
                    break;
                }
            }
        } catch (ErrorServiceException ex) {
            throw ex;
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new ErrorServiceException("Error de sistemas");
        }
    }

}