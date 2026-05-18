package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Usuario;
import com.cm.restaurant_server.business.logic.error.ErrorServiceException;
import com.cm.restaurant_server.business.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService extends BaseService<Usuario> {

    private final UsuarioRepository repository;

    @Autowired
    public UsuarioService(UsuarioRepository repository) {
        super(repository);
        this.repository = repository;
    }

    public Usuario crear(Usuario usuario) {
        usuario.setClave(new BCryptPasswordEncoder().encode(usuario.getClave()));
        return repository.save(usuario);
    }

    public Usuario searchByCuenta(String cuenta) throws Exception {
        try {
            Usuario usuario = repository.findByEmailAndEliminadoFalse(cuenta);
            return usuario;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    /*
     * public Usuario searchByIdPersona(String idPersona) throws Exception {
     * try {
     * Usuario usuario = repository.findByPersonaId(idPersona);
     * return usuario;
     * } catch (Exception e) {
     * throw new Exception(e.getMessage());
     * }
     * }
     * 
     */

    public Usuario searchByCuentaAndClave(String cuenta, String clave) throws Exception {
        try {
            Usuario usuario = repository.findByEmailAndClaveAndEliminadoFalse(cuenta, clave);
            return usuario;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    protected void validar(Usuario entity, CasoValidar caso) throws Exception {
        try {
            if (entity.getEmail() == null || entity.getEmail().isEmpty()) {
                throw new ErrorServiceException("Debe indicar el mail");
            }

            if (entity.getClave() == null || entity.getClave().isEmpty()) {
                throw new ErrorServiceException("Debe indicar la clave");
            }

            if (entity.getRol() == null) {
                throw new ErrorServiceException("Debe indicar el rol");
            }

            if (caso == CasoValidar.SAVE) {
                if (repository.findByIdAndEliminadoFalse(entity.getId()).isPresent()) {
                    throw new ErrorServiceException("El usuario ya existe en el sistema");
                }
                if (repository.findByEmailAndClaveAndEliminadoFalse(entity.getEmail(), entity.getClave()) != null) {
                    throw new ErrorServiceException("El usuario ya existe en el sistema");
                }
            } else {
                Optional<Usuario> uu = repository.findByIdAndEliminadoFalse(entity.getId());
                if (uu.isPresent()) {
                    Usuario e = uu.get();
                    if (!e.getId().equals(entity.getId())) {
                        throw new ErrorServiceException("El empleado especificado no existe en el sistema");
                    }
                }
            }
        } catch (ErrorServiceException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ErrorServiceException("Error de sistemas");
        }
    }

    public Optional<Usuario> buscarPorEmail(String email) throws ErrorServiceException {
        try {
            Usuario usuario = repository.findByEmailAndEliminadoFalse(email);
            if (usuario == null) {
                return Optional.empty();
            }
            return Optional.of(usuario);
        } catch (Exception ex) {
            throw new ErrorServiceException("Error encontrando el usuario");
        }
    }

}
