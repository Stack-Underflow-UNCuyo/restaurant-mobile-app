package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Provincia;
import com.cm.restaurant_server.business.logic.error.ErrorServiceException;
import com.cm.restaurant_server.business.repository.ProvinciaRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProvinciaService extends BaseService<Provincia> {

    private final ProvinciaRepository provinciaRepository;

    @Autowired
    public ProvinciaService(ProvinciaRepository repository) {
        super(repository);
        this.provinciaRepository = repository;
    }

    @Transactional
    public Provincia findByName(String name) throws Exception {
        try {
            Optional<Provincia> entityOptional = provinciaRepository.findByNombreAndEliminadoFalse(name);
            return entityOptional.orElseThrow(() -> new Exception("Entity not found or marked as deleted"));
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    protected void validar(Provincia entity, String caso) throws ErrorServiceException {
        try {
            if (entity.getNombre() == null || entity.getNombre().isEmpty()) {
                throw new ErrorServiceException("Debe indicar el nombre");
            }
            switch (caso) {
                case "SAVE": {
                    if (provinciaRepository.existsByNombreAndEliminadoFalse(entity.getNombre())) {
                        throw new ErrorServiceException("La provincia " + entity.getNombre() + " ya existe en el sistema");
                    }
                    break;
                }
                case "UPDATE": {
                    Optional<Provincia> provinciaOptional = provinciaRepository.findByNombreAndEliminadoFalse(entity.getNombre());
                    if (provinciaOptional.isPresent()) {
                        Provincia provincia = provinciaOptional.get();
                        if (!provincia.getId().equals(entity.getId())) {
                            throw new ErrorServiceException("La provincia " + entity.getNombre() + " ya existe en el sistema");
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