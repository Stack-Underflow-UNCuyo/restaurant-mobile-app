package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.Contacto;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactoRepository extends BaseRepository<Contacto> {

    @Modifying
    @Query(value = "UPDATE contacto SET empresa_id = :empresaId WHERE id IN :ids", nativeQuery = true)
    void setEmpresaId(@Param("empresaId") String empresaId, @Param("ids") List<String> ids);
}
