package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.Usuario;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UsuarioRepository extends BaseRepository<Usuario> {
    Usuario findByEmailAndClaveAndEliminadoFalse(String email, String clave);
    Usuario findByEmail(String email);

    /*@Query("SELECT u FROM Usuario u WHERE u.id = (SELECT p.usuario.id FROM Persona p WHERE p.id = :personaId)")
    Usuario findByPersonaId(@Param("personaId") String personaId);
     */

    Usuario findByEmailAndEliminadoFalse(String email);
}
