package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.Promocion;

import java.util.List;

import org.springframework.stereotype.Repository;

@Repository
public interface PromocionRepository extends BaseRepository<Promocion> {
    List<Promocion> findByDescripcionContainingIgnoreCase(String trim);
}
