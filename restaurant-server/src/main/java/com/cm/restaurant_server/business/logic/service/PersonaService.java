package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Persona;
import com.cm.restaurant_server.business.repository.BaseRepository;
import com.cm.restaurant_server.business.repository.PersonaRepository;
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
