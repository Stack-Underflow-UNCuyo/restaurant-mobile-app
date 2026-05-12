package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.MovimientoStock;
import com.cm.restaurant_server.business.repository.MovimientoStockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MovimientoStockService extends BaseService<MovimientoStock> {
    @Autowired
    public MovimientoStockService(MovimientoStockRepository repository) {
        super(repository);
    }
}
