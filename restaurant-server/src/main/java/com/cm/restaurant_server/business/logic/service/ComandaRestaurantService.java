package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.ComandaRestaurant;
import com.cm.restaurant_server.business.repository.ComandaRestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComandaRestaurantService extends BaseService<ComandaRestaurant> {

    private final ComandaRestaurantRepository repository;

    @Autowired
    public ComandaRestaurantService(ComandaRestaurantRepository repository) {
        super(repository);
        this.repository = repository;
    }

    @Override
    protected void validar(ComandaRestaurant entity, CasoValidar caso) throws Exception {

    }

    public List<ComandaRestaurant> findAllByMesa(String mesaRestauranteId) {
        return repository.findAllByMesaRestauranteIdAndEliminadoFalse(mesaRestauranteId);
    }
}
