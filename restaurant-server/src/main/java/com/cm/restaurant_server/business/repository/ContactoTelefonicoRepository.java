package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.ContactoTelefonico;
import com.cm.restaurant_server.business.domain.enumeration.TipoContacto;
import com.cm.restaurant_server.business.domain.enumeration.TipoTelefono;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContactoTelefonicoRepository extends BaseRepository<ContactoTelefonico> {

    boolean existsByTelefonoAndEliminadoFalse(String telefono);

    Optional<ContactoTelefonico> findByTelefonoAndTipoContactoAndTipoTelefonoAndEliminadoFalse(
            String telefono, TipoContacto tipoContacto, TipoTelefono tipoTelefono);
}
