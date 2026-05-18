package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.contacto.ContactoDto;
import com.cm.restaurant_server.business.domain.entity.Contacto;
import com.cm.restaurant_server.business.logic.service.ContactoService;
import com.cm.restaurant_server.business.mapper.ContactoMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/contactos")
public class ContactoController {

    private final ContactoService service;
    private final ContactoMapper mapper;

    public ContactoController(ContactoService service, ContactoMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping
    public ResponseEntity<List<ContactoDto>> getAll() throws Exception {
        List<Contacto> entities = service.findAll();
        return ResponseEntity.ok(mapper.toDTOsList(entities));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactoDto> getById(@PathVariable String id) throws Exception {
        Contacto entity = service.findById(id);
        return ResponseEntity.ok(mapper.toDTO(entity));
    }
}
