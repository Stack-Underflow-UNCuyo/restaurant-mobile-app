package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.contacto.ContactoCorreoElectronicoCreateDto;
import com.cm.restaurant_server.business.domain.dto.contacto.ContactoCorreoElectronicoDto;
import com.cm.restaurant_server.business.domain.entity.ContactoCorreoElectronico;
import com.cm.restaurant_server.business.logic.service.ContactoCorreoElectronicoService;
import com.cm.restaurant_server.business.mapper.ContactoCorreoElectronicoMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/contactos-correo")
public class ContactoCorreoElectronicoController extends BaseController<ContactoCorreoElectronico, ContactoCorreoElectronicoDto, ContactoCorreoElectronicoCreateDto, ContactoCorreoElectronicoCreateDto> {

    public ContactoCorreoElectronicoController(ContactoCorreoElectronicoService service, ContactoCorreoElectronicoMapper mapper) {
        super(service, mapper);
    }
}
