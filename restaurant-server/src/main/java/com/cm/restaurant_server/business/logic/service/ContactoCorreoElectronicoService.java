package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.ContactoCorreoElectronico;
import com.cm.restaurant_server.business.logic.error.ErrorServiceException;
import com.cm.restaurant_server.business.repository.ContactoCorreoElectronicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class ContactoCorreoElectronicoService extends BaseService<ContactoCorreoElectronico> {

    private ContactoCorreoElectronicoRepository contactoRepository;

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$");

    @Autowired
    public ContactoCorreoElectronicoService(ContactoCorreoElectronicoRepository repository) {
        super(repository);
        this.contactoRepository = repository;
    }

    @Override
    protected void validar(ContactoCorreoElectronico contacto, CasoValidar caso) throws Exception {
        try {
            if (contacto.getTipoContacto() == null) {
                throw new ErrorServiceException("Debe indicar qué tipo de contacto es");
            }
            if (contacto.getEmail() == null || contacto.getEmail().trim().isEmpty()) {
                throw new ErrorServiceException("Debe indicar el email");
            }
            if (!emailValido(contacto.getEmail())) {
                throw new ErrorServiceException("Debe indicar un email válido");
            }

            switch (caso) {
                case SAVE: {
                    if (contactoRepository.existsByEmailAndEliminadoFalse(contacto.getEmail().trim())) {
                        throw new ErrorServiceException("El sistema ya cuenta con el correo electrónico "
                                        + contacto.getEmail() + " registrado en el sistema");
                    }
                    break;
                }
                case UPDATE: {
                    Optional<ContactoCorreoElectronico> existenteOptional = contactoRepository
                            .findByEmailAndTipoContactoAndEliminadoFalse(contacto.getEmail().trim(),contacto.getTipoContacto());

                    if (existenteOptional.isPresent()) {
                        ContactoCorreoElectronico contactoExistente = existenteOptional.get();
                        if (!contactoExistente.getId().equals(contacto.getId())) {
                            throw new ErrorServiceException(
                                    "Ya existe otro contacto con el mismo email y tipo de contacto para esta persona");
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

    private boolean emailValido(String email) {
        return EMAIL_PATTERN.matcher(email).matches();
    }
}
