package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Pais;
import com.cm.restaurant_server.business.logic.error.ErrorServiceException;
import com.cm.restaurant_server.business.repository.PaisRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PaisService extends BaseService<Pais> {

    private final PaisRepository paisRepository;

    @Autowired
    public PaisService(PaisRepository repository) {
        super(repository);
        this.paisRepository = repository;
    }

    @Transactional
    public Pais findByName(String name) throws Exception {
        try {
            Optional<Pais> entityOptional = paisRepository.findByNombreAndEliminadoFalse(name);
            return entityOptional.orElseThrow(() -> new Exception("Entity not found or marked as deleted"));
        } catch (Exception e) {
                throw new Exception(e.getMessage());
        }
    }

    @Override
    protected void validar(Pais entity, String caso) throws ErrorServiceException {
        try {
            if (entity.getNombre() == null || entity.getNombre().isEmpty()) {
                throw new ErrorServiceException("Debe indicar el nombre");
            }
            switch (caso) {
                case "SAVE": {
                    if (paisRepository.existsByNombreAndEliminadoFalse(entity.getNombre())) {
                        throw new ErrorServiceException("El pais " + entity.getNombre() + " ya existe en el sistema");
                    }
                    break;
                }
                case "UPDATE": {
                    Optional<Pais> paisOptional = paisRepository.findByNombreAndEliminadoFalse(entity.getNombre());
                    if (paisOptional.isPresent()) {
                        Pais pais = paisOptional.get();
                        if (!pais.getId().equals(entity.getId())) {
                            throw new ErrorServiceException("El pais " + entity.getNombre() + " ya existe en el sistema");
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