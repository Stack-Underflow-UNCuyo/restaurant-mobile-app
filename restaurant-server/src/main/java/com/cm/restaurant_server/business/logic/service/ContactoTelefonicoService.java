package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.ContactoTelefonico;
import com.cm.restaurant_server.business.logic.error.ErrorServiceException;
import com.cm.restaurant_server.business.repository.ContactoTelefonicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class ContactoTelefonicoService extends BaseService<ContactoTelefonico> {
    private final ContactoTelefonicoRepository contactoRepository;

    // Regex para validar teléfonos (permite números, espacios, guiones y un '+'
    // inicial opcional)
    private static final Pattern TELEFONO_PATTERN = Pattern.compile(
            "^\\+?[0-9\\s\\-]{6,20}$");

    @Autowired
    public ContactoTelefonicoService(ContactoTelefonicoRepository repository) {
        super(repository);
        this.contactoRepository = repository;
    }

    @Override
    protected void validar(ContactoTelefonico contacto, CasoValidar caso) throws Exception {
        try {
            if (contacto.getTipoContacto() == null) {
                throw new ErrorServiceException(
                        "Debe indicar qué tipo de contacto es (Personal, Laboral o Empresarial)");
            }
            if (contacto.getTipoTelefono() == null) {
                throw new ErrorServiceException("Debe indicar qué tipo de teléfono es (Fijo o Celular)");
            }
            if (contacto.getPersona() == null || contacto.getPersona().getId() == null) {
                throw new ErrorServiceException("Debe indicar la persona asociada al contacto");
            }
            if (contacto.getTelefono() == null || contacto.getTelefono().trim().isEmpty()) {
                throw new ErrorServiceException("Debe indicar el teléfono");
            }
            if (!telefonoValido(contacto.getTelefono())) {
                throw new ErrorServiceException("Debe indicar un teléfono válido (mínimo 6 dígitos numéricos)");
            }

            switch (caso) {
                case SAVE: {
                    if (contactoRepository.existsByTelefonoAndPersona_IdAndEliminadoFalse(
                            contacto.getTelefono().trim(), contacto.getPersona().getId())) {
                        throw new ErrorServiceException(contacto.getPersona().getNombre() +
                                " ya cuenta con el teléfono " + contacto.getTelefono() + " registrado en el sistema");
                    }
                    break;
                }
                case UPDATE: {
                    Optional<ContactoTelefonico> existenteOptional = contactoRepository
                            .findByTelefonoAndPersona_IdAndTipoContactoAndTipoTelefonoAndEliminadoFalse(
                                    contacto.getTelefono().trim(),
                                    contacto.getPersona().getId(),
                                    contacto.getTipoContacto(),
                                    contacto.getTipoTelefono());

                    if (existenteOptional.isPresent()) {
                        ContactoTelefonico contactoExistente = existenteOptional.get();
                        if (!contactoExistente.getId().equals(contacto.getId())) {
                            throw new ErrorServiceException(
                                    "Ya existe otro contacto con el mismo teléfono, tipo de contacto y tipo de teléfono para esta persona");
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

    private boolean telefonoValido(String telefono) {
        return TELEFONO_PATTERN.matcher(telefono).matches();
    }
}
