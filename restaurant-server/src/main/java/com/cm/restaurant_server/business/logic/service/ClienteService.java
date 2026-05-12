package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Cliente;
import com.cm.restaurant_server.business.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClienteService extends BaseService<Cliente> {
    @Autowired
    public ClienteService(ClienteRepository repository) {
        super(repository);
    }
}
