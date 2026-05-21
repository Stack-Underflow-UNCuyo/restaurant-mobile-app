package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Departamento;
import com.cm.restaurant_server.business.domain.entity.Localidad;
import com.cm.restaurant_server.business.domain.entity.Pais;
import com.cm.restaurant_server.business.domain.entity.Provincia;
import com.cm.restaurant_server.business.logic.error.ErrorServiceException;
import com.cm.restaurant_server.business.repository.PaisRepository;
import com.cm.restaurant_server.business.repository.ProvinciaRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProvinciaService extends BaseService<Provincia> {

    private final ProvinciaRepository provinciaRepository;
    private final PaisRepository paisRepository;

    @Autowired
    public ProvinciaService(ProvinciaRepository repository, PaisRepository paisRepository) {
        super(repository);
        this.provinciaRepository = repository;
        this.paisRepository = paisRepository;
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
    @Transactional
    public Provincia update(String id, Provincia provinciaUpdated) throws Exception {
        try {
            // service busca la entidad existente 
            Provincia existing = provinciaRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new Exception("Entidad no encontrada o marcada como eliminada"));

            // busca la localidad indicada en el dto
            Pais pais = paisRepository
                .findById(provinciaUpdated.getPais().getId())
                .orElseThrow(() -> new ErrorServiceException("Debe indicar el país."));

            // actualizar campos 
            existing.setNombre(provinciaUpdated.getNombre());
            existing.setPais(pais);

            validar(existing, CasoValidar.UPDATE);

            return provinciaRepository.save(existing);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    protected void validar(Provincia entity, CasoValidar caso) throws ErrorServiceException {
        try {
            if (entity.getNombre() == null || entity.getNombre().isEmpty()) {
                throw new ErrorServiceException("Debe indicar el nombre");
            }
            switch (caso) {
                case SAVE: {
                    if (provinciaRepository.existsByNombreAndEliminadoFalse(entity.getNombre())) {
                        throw new ErrorServiceException(
                                "La provincia " + entity.getNombre() + " ya existe en el sistema");
                    }
                    break;
                }
                case UPDATE: {
                    Optional<Provincia> provinciaOptional = provinciaRepository
                            .findByNombreAndEliminadoFalse(entity.getNombre());
                    if (provinciaOptional.isPresent()) {
                        Provincia provincia = provinciaOptional.get();
                        if (!provincia.getId().equals(entity.getId())) {
                            throw new ErrorServiceException(
                                    "La provincia " + entity.getNombre() + " ya existe en el sistema");
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