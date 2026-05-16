package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Localidad;
import com.cm.restaurant_server.business.logic.error.ErrorServiceException;
import com.cm.restaurant_server.business.repository.LocalidadRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LocalidadService extends BaseService<Localidad> {

    private final LocalidadRepository localidadRepository;

    @Autowired
    public LocalidadService(LocalidadRepository repository) {
        super(repository);
        this.localidadRepository = repository;
    }

    @Transactional
    public Localidad findByName(String name) throws Exception {
        try {
            Optional<Localidad> entityOptional = localidadRepository.findByNombreAndEliminadoFalse(name);
            return entityOptional.orElseThrow(() -> new Exception("Entity not found or marked as deleted"));
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Transactional
    public Localidad findByCodigoPostal(String codigoPostal) throws Exception {
        try {
            Optional<Localidad> entityOptional = localidadRepository.findByCodigoPostalAndEliminadoFalse(codigoPostal);
            return entityOptional.orElseThrow(() -> new Exception("Entity not found or marked as deleted"));
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    protected void validar(Localidad entity, String caso) throws ErrorServiceException {
        try {
            if (entity.getNombre() == null || entity.getNombre().isEmpty()) {
                throw new ErrorServiceException("Debe indicar el nombre");
            }
            if (entity.getCodigoPostal() == null || entity.getCodigoPostal().isEmpty()) {
                throw new ErrorServiceException("Debe indicar el codigo postal");
            }
            if (entity.getDepartamento() == null) {
                throw new ErrorServiceException("Debe indicar el departamento");
            }
            switch (caso) {
                case "SAVE": {
                    if (localidadRepository.existsByNombreAndEliminadoFalse(entity.getNombre())) {
                        throw new ErrorServiceException("La localidad " + entity.getNombre() + " ya existe en el sistema");
                    } else if (localidadRepository.existsByCodigoPostalAndEliminadoFalse(entity.getCodigoPostal())) {
                        throw new ErrorServiceException("Ya hay una localidad con el código postal " + entity.getCodigoPostal() + " en el sistema");
                    }
                    break;
                }
                case "UPDATE": {
                    Optional<Localidad> localidadOptional = localidadRepository.findByNombreAndEliminadoFalse(entity.getNombre());
                    if (localidadOptional.isPresent()) {
                        Localidad localidad = localidadOptional.get();
                        if (!localidad.getId().equals(entity.getId())) {
                            throw new ErrorServiceException("La localidad " + entity.getNombre() + " ya existe en el sistema");
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