package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Departamento;
import com.cm.restaurant_server.business.domain.entity.Direccion;
import com.cm.restaurant_server.business.domain.entity.Localidad;
import com.cm.restaurant_server.business.logic.error.ErrorServiceException;
import com.cm.restaurant_server.business.repository.DepartamentoRepository;
import com.cm.restaurant_server.business.repository.LocalidadRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LocalidadService extends BaseService<Localidad> {

    private final DepartamentoRepository departamentoRepository;
    private final LocalidadRepository localidadRepository;

    @Autowired
    public LocalidadService(LocalidadRepository repository, DepartamentoRepository departamentoRepository) {
        super(repository);
        this.localidadRepository = repository;
        this.departamentoRepository = departamentoRepository;
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
    @Transactional
    public Localidad update(String id, Localidad localidadUpdated) throws Exception {
        try {
            // service busca la entidad existente 
            Localidad existing = localidadRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new Exception("Entidad no encontrada o marcada como eliminada"));

            // busca la localidad indicada en el dto
            Departamento departamento = departamentoRepository
                .findById(localidadUpdated.getDepartamento().getId())
                .orElseThrow(() -> new ErrorServiceException("Debe indicar la localidad."));

            // actualizar campos 
            existing.setNombre(localidadUpdated.getNombre());
            existing.setCodigoPostal(localidadUpdated.getCodigoPostal());
            existing.setDepartamento(departamento);

            validar(existing, CasoValidar.UPDATE);

            return localidadRepository.save(existing);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    protected void validar(Localidad entity, CasoValidar caso) throws ErrorServiceException {
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
                case SAVE: {
                    if (localidadRepository.existsByNombreAndEliminadoFalse(entity.getNombre())) {
                        throw new ErrorServiceException(
                                "La localidad " + entity.getNombre() + " ya existe en el sistema");
                    } else if (localidadRepository.existsByCodigoPostalAndEliminadoFalse(entity.getCodigoPostal())) {
                        throw new ErrorServiceException("Ya hay una localidad con el código postal "
                                + entity.getCodigoPostal() + " en el sistema");
                    }
                    break;
                }
                case UPDATE: {
                    Optional<Localidad> localidadOptional = localidadRepository
                            .findByNombreAndEliminadoFalse(entity.getNombre());
                    if (localidadOptional.isPresent()) {
                        Localidad localidad = localidadOptional.get();
                        if (!localidad.getId().equals(entity.getId())) {
                            throw new ErrorServiceException(
                                    "La localidad " + entity.getNombre() + " ya existe en el sistema");
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