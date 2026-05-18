package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.persona.PersonaCreateDto;
import com.cm.restaurant_server.business.domain.dto.persona.PersonaDto;
import com.cm.restaurant_server.business.domain.entity.Persona;
import com.cm.restaurant_server.business.logic.service.PersonaService;
import com.cm.restaurant_server.business.mapper.PersonaMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/personas")
public class PersonaController extends BaseController<Persona, PersonaDto, PersonaCreateDto, PersonaCreateDto> {

    public PersonaController(PersonaService service, PersonaMapper mapper) {
        super(service, mapper);
    }

    @PutMapping("/{id}/usuario/{usuarioId}")
    public ResponseEntity<PersonaDto> vincularUsuario(
            @PathVariable String id, @PathVariable String usuarioId) throws Exception {
        Persona persona = ((PersonaService<Persona>) service).vincularUsuario(id, usuarioId);
        return ResponseEntity.ok(mapper.toDTO(persona));
    }
}
