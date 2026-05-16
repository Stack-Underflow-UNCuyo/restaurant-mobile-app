package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Direccion;
import com.cm.restaurant_server.business.domain.entity.Localidad;
import com.cm.restaurant_server.business.logic.error.ErrorServiceException;
import com.cm.restaurant_server.business.repository.DireccionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DireccionService extends BaseService<Direccion> {
    private DireccionRepository direccionRepository;
    @Autowired
    public DireccionService(DireccionRepository repository) {
        super(repository);
        this.direccionRepository = repository;
    }

    @Transactional
    public Direccion findByCalleAndNumeracion(String calle, String numeracion) throws Exception {
        try {
            Optional<Direccion> entityOptional = direccionRepository.findByCalleAndNumeracionAndEliminadoFalse(calle, numeracion);
            return entityOptional.orElseThrow(() -> new Exception("Entity not found or marked as deleted"));
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    protected void validar(Direccion entity, String caso) throws ErrorServiceException {
        try {
            if (entity.getCalle() == null || entity.getCalle().trim().isEmpty()) {
                throw new ErrorServiceException("Debe indicar la calle.");
            }

            if (entity.getNumeracion() == null || entity.getNumeracion().trim().isEmpty()) {
                throw new ErrorServiceException("El campo debe contener hasta 8 dígitos enteros.");
            }

            if (entity.getBarrio() == null || entity.getBarrio().trim().isEmpty()) {
                throw new ErrorServiceException("Debe indicar el barrio.");
            }

            if (entity.getLocalidad() == null) {
                throw new ErrorServiceException("Debe indicar la localidad.");
            }

            switch (caso) {
                case "SAVE": {
                    if (direccionRepository.existsByCalleAndNumeracionAndBarrioAndLocalidad_IdAndEliminadoFalse(entity.getCalle(),
                            entity.getNumeracion(), entity.getBarrio(), entity.getLocalidad().getId())) {
                        throw new ErrorServiceException("La dirección ingresada ya existe en el sistema");
                    }
                }
                break;
                case "UPDATE": {
                    Optional<Direccion> direccionOptional = direccionRepository.findByCalleAndNumeracionAndBarrioAndLocalidad_IdAndEliminadoFalse(
                            entity.getCalle(), entity.getNumeracion(), entity.getBarrio(), entity.getLocalidad().getId());
                    if (direccionOptional.isPresent()) {
                        Direccion direccion = direccionOptional.get();
                        if (!direccion.getId().equals(entity.getId())) {
                            throw new ErrorServiceException("La dirección ingresada ya existe en el sistema");
                        }
                    }
                }
                break;
            }
        } catch (ErrorServiceException ex) {
            throw ex;
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new ErrorServiceException("Error de sistemas");
        }
    }
}

