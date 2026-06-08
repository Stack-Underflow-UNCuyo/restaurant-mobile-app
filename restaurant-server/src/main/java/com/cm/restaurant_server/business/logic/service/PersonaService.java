package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Persona;
import com.cm.restaurant_server.business.repository.BaseRepository;
import com.cm.restaurant_server.business.repository.PersonaRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class PersonaService<T extends Persona> extends BaseService<T> {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    @SuppressWarnings("unchecked")
    public PersonaService(PersonaRepository repository) {
        super((BaseRepository<T>) repository);
    }

    protected PersonaService(BaseRepository<T> repository) {
        super(repository);
    }

    @Override
    @Transactional
    public T update(String id, T entity) throws Exception {
        try {
            T existing = findById(id);
            existing.setNombre(entity.getNombre());
            existing.setApellido(entity.getApellido());
            existing.setFechaNacimiento(entity.getFechaNacimiento());
            existing.setTipoDocumento(entity.getTipoDocumento());
            existing.setNumeroDocumento(entity.getNumeroDocumento());
            existing.setDireccion(entity.getDireccion());
            existing.getContactosCorreosElectronicos().clear();
            existing.getContactosCorreosElectronicos().addAll(entity.getContactosCorreosElectronicos());
            existing.getContactosTelefonicos().clear();
            existing.getContactosTelefonicos().addAll(entity.getContactosTelefonicos());
            validar(existing, CasoValidar.UPDATE);
            return baseRepository.save(existing);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    protected void validar(T entity, CasoValidar caso) throws Exception {
        System.out.println(entity.getNombre());
        System.out.println("Direccion id: " +entity.getDireccion().getId());

        if (entity.getNombre() == null || entity.getNombre().isEmpty()) {
            throw new Exception("El nombre es obligatorio");
        }

        if (entity.getApellido() == null || entity.getApellido().isEmpty()) {
            throw new Exception("El apellido es obligatorio");
        }

        if (entity.getNumeroDocumento() == null || entity.getNumeroDocumento().isEmpty()) {
            throw new Exception("El número de documento es obligatorio");
        }

        if (entity.getTipoDocumento() == null) {
            throw new Exception("El tipo de documento es obligatorio");
        }

        if (entity.getDireccion().getId() == null) {
            throw new Exception("La dirección es obligatoria");
        }

        if (entity.getFechaNacimiento() == null || entity.getFechaNacimiento().isAfter(LocalDate.now())) {
            throw new Exception("La fecha de nacimiento es obligatoria");
        }
    }
}
