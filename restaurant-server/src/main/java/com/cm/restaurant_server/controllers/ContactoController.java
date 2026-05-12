package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.contacto.ContactoCreateDto;
import com.cm.restaurant_server.business.domain.dto.contacto.ContactoDto;
import com.cm.restaurant_server.business.domain.entity.Contacto;
import com.cm.restaurant_server.business.logic.service.ContactoService;
import com.cm.restaurant_server.business.mapper.ContactoMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/contactos")
public class ContactoController extends BaseController<Contacto, ContactoDto, ContactoCreateDto, ContactoCreateDto> {

    public ContactoController(ContactoService service, ContactoMapper mapper) {
        super(service, mapper);
    }
}
