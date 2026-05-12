package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.contacto.ContactoTelefonicoCreateDto;
import com.cm.restaurant_server.business.domain.dto.contacto.ContactoTelefonicoDto;
import com.cm.restaurant_server.business.domain.entity.ContactoTelefonico;
import com.cm.restaurant_server.business.logic.service.ContactoTelefonicoService;
import com.cm.restaurant_server.business.mapper.ContactoTelefonicoMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/contactos-telefonicos")
public class ContactoTelefonicoController extends BaseController<ContactoTelefonico, ContactoTelefonicoDto, ContactoTelefonicoCreateDto, ContactoTelefonicoCreateDto> {

    public ContactoTelefonicoController(ContactoTelefonicoService service, ContactoTelefonicoMapper mapper) {
        super(service, mapper);
    }
}
