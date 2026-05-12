package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.ReservaMensa;
import com.cm.restaurant_server.business.repository.ReservaMensaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReservaMensaService extends BaseService<ReservaMensa> {
    @Autowired
    public ReservaMensaService(ReservaMensaRepository repository) {
        super(repository);
    }
}
