package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.dto.empresa.EmpresaCreateDto;
import com.cm.restaurant_server.business.domain.entity.Contacto;
import com.cm.restaurant_server.business.domain.entity.ContactoCorreoElectronico;
import com.cm.restaurant_server.business.domain.entity.ContactoTelefonico;
import com.cm.restaurant_server.business.domain.entity.Direccion;
import com.cm.restaurant_server.business.domain.entity.Empresa;
import com.cm.restaurant_server.business.logic.error.ErrorServiceException;
import com.cm.restaurant_server.business.repository.ContactoRepository;
import com.cm.restaurant_server.business.repository.DireccionRepository;
import com.cm.restaurant_server.business.repository.EmpresaRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class EmpresaService extends BaseService<Empresa> {

    private final EmpresaRepository empresaRepository;
    private final DireccionRepository direccionRepository;
    private final ContactoRepository contactoRepository;

    public EmpresaService(EmpresaRepository repository, DireccionRepository direccionRepository,
                          ContactoRepository contactoRepository) {
        super(repository);
        this.empresaRepository = repository;
        this.direccionRepository = direccionRepository;
        this.contactoRepository = contactoRepository;
    }

    @Transactional
    public Empresa findActive() throws Exception {
        try {
            return empresaRepository.findFirstByEliminadoFalse()
                    .orElseGet(this::createDefault);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    private Empresa createDefault() {
        Empresa empresa = new Empresa();
        empresa.setNombre("Mi Restaurante");
        return empresaRepository.save(empresa);
    }

    @Transactional
    public Empresa updateFromDto(String id, EmpresaCreateDto dto) throws Exception {
        try {
            Empresa existing = empresaRepository.findByIdAndEliminadoFalse(id)
                    .orElseThrow(() -> new Exception("Empresa no encontrada o marcada como eliminada"));

            existing.setNombre(dto.getNombre());

            if (dto.getDireccionId() != null && !dto.getDireccionId().isBlank()) {
                Direccion dir = direccionRepository.findByIdAndEliminadoFalse(dto.getDireccionId())
                        .orElseThrow(() -> new Exception("Dirección no encontrada"));
                existing.setDireccion(dir);
            }

            List<String> nuevosContactoIds = new ArrayList<>();
            if (dto.getContactoIds() != null && !dto.getContactoIds().isEmpty()) {
                for (String contactoId : dto.getContactoIds()) {
                    contactoRepository.findByIdAndEliminadoFalse(contactoId).ifPresent(c -> {
                        existing.getContactos().add(c);
                        nuevosContactoIds.add(c.getId());
                    });
                }
            }

            validar(existing, CasoValidar.UPDATE);
            Empresa saved = empresaRepository.save(existing);

            // Hibernate's unidirectional @OneToMany + @JoinColumn does not reliably
            // UPDATE the FK for already-persisted entities, so we set it explicitly.
            if (!nuevosContactoIds.isEmpty()) {
                contactoRepository.setEmpresaId(saved.getId(), nuevosContactoIds);
            }

            return saved;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
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
                if (contacto.getEliminado()) continue;
                if (contacto instanceof ContactoTelefonico) tieneTelefono = true;
                else if (contacto instanceof ContactoCorreoElectronico) tieneCorreo = true;
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
}
