package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Stock;
import com.cm.restaurant_server.business.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StockService extends BaseService<Stock> {
    @Autowired
    public StockService(StockRepository repository) {
        super(repository);
    }
}
