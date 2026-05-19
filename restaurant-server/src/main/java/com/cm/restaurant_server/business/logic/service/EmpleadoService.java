package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Empleado;
import com.cm.restaurant_server.business.domain.entity.Usuario;
import com.cm.restaurant_server.business.repository.EmpleadoRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

@Service
public class EmpleadoService extends PersonaService<Empleado> {
    public EmpleadoService(EmpleadoRepository repository) {
        super(repository);
    }

    @Override
    protected void validar(Empleado entity, CasoValidar caso) throws Exception {
        super.validar(entity, caso);

        if (entity.getTipoEmpleado() == null) {
            throw new Exception("El tipo de empleado es obligatorio");
        }
    }

    @Transactional
    public void asociarEmpleadoUsuario(Empleado empleado, Usuario usuario) {
        usuario.setPersona(empleado);
    }
}
