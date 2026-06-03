package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.Resenia;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReseniaRepository extends BaseRepository<Resenia> {
    List<Resenia> findByComandaIdAndEliminadoFalse(String comandaId);
}
