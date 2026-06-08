package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.ComandaRestaurant;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComandaRestaurantRepository extends BaseRepository<ComandaRestaurant> {
    List<ComandaRestaurant> findAllByMesaRestauranteIdAndEliminadoFalse(String mesaRestauranteId);
}
