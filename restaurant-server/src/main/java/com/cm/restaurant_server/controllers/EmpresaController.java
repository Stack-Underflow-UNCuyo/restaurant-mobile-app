package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.empresa.EmpresaCreateDto;
import com.cm.restaurant_server.business.domain.dto.empresa.EmpresaDto;
import com.cm.restaurant_server.business.domain.entity.Empresa;
import com.cm.restaurant_server.business.logic.service.EmpresaService;
import com.cm.restaurant_server.business.mapper.EmpresaMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/empresa")
public class EmpresaController {

    private final EmpresaService service;
    private final EmpresaMapper mapper;

    public EmpresaController(EmpresaService service, EmpresaMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping
    public ResponseEntity<EmpresaDto> getActive() throws Exception {
        Empresa empresa = service.findActive();
        return ResponseEntity.ok(mapper.toDTO(empresa));
    }

    @PutMapping
    public ResponseEntity<EmpresaDto> update(@Valid @RequestBody EmpresaCreateDto dto) throws Exception {
        Empresa empresa = service.findActive();
        return ResponseEntity.ok(mapper.toDTO(service.updateFromDto(empresa.getId(), dto)));
    }
}
