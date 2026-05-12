package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.ComandaRestaurant;
import com.cm.restaurant_server.business.repository.ComandaRestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ComandaRestaurantService extends BaseService<ComandaRestaurant> {
    @Autowired
    public ComandaRestaurantService(ComandaRestaurantRepository repository) {
        super(repository);
    }
}
