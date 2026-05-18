package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Contacto;
import com.cm.restaurant_server.business.domain.entity.ContactoCorreoElectronico;
import com.cm.restaurant_server.business.domain.entity.ContactoTelefonico;
import com.cm.restaurant_server.business.domain.entity.Empresa;
import com.cm.restaurant_server.business.logic.error.ErrorServiceException;
import com.cm.restaurant_server.business.repository.EmpresaRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EmpresaService extends BaseService<Empresa> {

    private EmpresaRepository empresaRepository;

    @Autowired
    public EmpresaService(EmpresaRepository repository) {
        super(repository);
        this.empresaRepository = repository;
    }

    @Override
    protected void validar(Empresa entity, CasoValidar caso) throws ErrorServiceException {
        try {
            if (entity.getNombre() == null || entity.getNombre().trim().isEmpty()) {
                throw new ErrorServiceException("Debe indicar el nombre de la empresa.");
            }
            if (entity.getDireccion() == null || entity.getDireccion().getId() == null) {
                throw new ErrorServiceException("Debe indicar la dirección de la empresa.");
            }

            if (entity.getContactos() == null || entity.getContactos().isEmpty()) {
                throw new ErrorServiceException("Debe indicar al menos un medio de contacto para la empresa.");
            }

            boolean tieneTelefono = false;
            boolean tieneCorreo = false;

            for (Contacto contacto : entity.getContactos()) {

                if (contacto.getEliminado()) {
                    continue;
                }

                if (contacto instanceof ContactoTelefonico) {
                    tieneTelefono = true;
                } else if (contacto instanceof ContactoCorreoElectronico) {
                    tieneCorreo = true;
                }
            }

            if (!tieneTelefono) {
                throw new ErrorServiceException("La empresa debe registrar al menos un contacto telefónico.");
            }
            if (!tieneCorreo) {
                throw new ErrorServiceException("La empresa debe registrar al menos un correo electrónico.");
            }

            switch (caso) {
                case SAVE: {
                    if (empresaRepository.existsByNombreAndEliminadoFalse(entity.getNombre().trim())) {
                        throw new ErrorServiceException(
                                "La empresa '" + entity.getNombre() + "' ya se encuentra registrada en el sistema.");
                    }
                    break;
                }
                case UPDATE: {
                    Optional<Empresa> empresaOptional = empresaRepository
                            .findByNombreAndEliminadoFalse(entity.getNombre().trim());
                    if (empresaOptional.isPresent()) {
                        Empresa empresaExistente = empresaOptional.get();
                        if (!empresaExistente.getId().equals(entity.getId())) {
                            throw new ErrorServiceException(
                                    "Ya existe otra empresa registrada con el nombre '" + entity.getNombre() + "'.");
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

    @Transactional
    public Empresa findByName(String name) throws Exception {
        try {
            Optional<Empresa> entityOptional = empresaRepository.findByNombreAndEliminadoFalse(name);
            return entityOptional.orElseThrow(() -> new Exception("Entity not found or marked as deleted"));
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

}
