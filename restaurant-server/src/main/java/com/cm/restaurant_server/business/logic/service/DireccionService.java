package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.dto.direccion.DireccionCreateDto;
import com.cm.restaurant_server.business.domain.entity.Direccion;
import com.cm.restaurant_server.business.domain.entity.Localidad;
import com.cm.restaurant_server.business.logic.error.ErrorServiceException;
import com.cm.restaurant_server.business.repository.DireccionRepository;
import com.cm.restaurant_server.business.repository.LocalidadRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DireccionService extends BaseService<Direccion> {
    private DireccionRepository direccionRepository;
    private LocalidadRepository localidadRepository;

    @Autowired
    public DireccionService(DireccionRepository repository, LocalidadRepository localidadRepository) {
        super(repository);
        this.direccionRepository = repository;
        this.localidadRepository = localidadRepository;
    }

    @Transactional
    public Direccion findByCalleAndNumeracion(String calle, String numeracion) throws Exception {
        try {
            Optional<Direccion> entityOptional = direccionRepository.findByCalleAndNumeracionAndEliminadoFalse(calle,
                    numeracion);
            return entityOptional.orElseThrow(() -> new Exception("Entidad no encontrada o marcada como eliminada"));
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    @Transactional
    public Direccion update(String id, Direccion direccionUpdated) throws Exception {
        try {
            // service busca la entidad existente 
            Direccion existing = direccionRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new Exception("Entidad no encontrada o marcada como eliminada"));

            // busca la localidad indicada en el dto
            Localidad localidad = localidadRepository
                .findById(direccionUpdated.getLocalidad().getId())
                .orElseThrow(() -> new ErrorServiceException("Debe indicar la localidad."));

            // actualizar campos 
            existing.setCalle(direccionUpdated.getCalle());
            existing.setNumeracion(direccionUpdated.getNumeracion());
            existing.setBarrio(direccionUpdated.getBarrio());
            existing.setLocalidad(localidad);

            validar(existing, CasoValidar.UPDATE);

            return direccionRepository.save(existing);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    protected void validar(Direccion entity, CasoValidar caso) throws ErrorServiceException {
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
                case SAVE: {
                    if (direccionRepository.existsByCalleAndNumeracionAndBarrioAndLocalidad_IdAndEliminadoFalse(
                            entity.getCalle(),
                            entity.getNumeracion(), entity.getBarrio(), entity.getLocalidad().getId())) {
                        throw new ErrorServiceException("La dirección ingresada ya existe en el sistema");
                    }
                }
                    break;
                case UPDATE: {
                    Optional<Direccion> direccionOptional = direccionRepository
                        .findByCalleAndNumeracionAndBarrioAndLocalidad_IdAndEliminadoFalse(
                            entity.getCalle(), entity.getNumeracion(), entity.getBarrio(),
                            entity.getLocalidad().getId());
                    
                    if (direccionOptional.isPresent() && !direccionOptional.get().getId().equals(entity.getId())) {
                        throw new ErrorServiceException("La dirección ingresada ya existe en el sistema");
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
