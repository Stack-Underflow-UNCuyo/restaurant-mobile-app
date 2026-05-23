package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.ContactoCorreoElectronico;
import com.cm.restaurant_server.business.domain.enumeration.TipoContacto;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContactoCorreoElectronicoRepository extends BaseRepository<ContactoCorreoElectronico> {

    boolean existsByEmailAndEliminadoFalse(String email);

    Optional<ContactoCorreoElectronico> findByEmailAndTipoContactoAndEliminadoFalse(
            String email, TipoContacto tipoContacto);
}
