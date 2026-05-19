package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.entity.Base;
import com.cm.restaurant_server.business.logic.service.BaseService;
import com.cm.restaurant_server.business.mapper.BaseMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

public abstract class BaseController<Entity extends Base, Dto extends BaseDto, CreateDto, UpdateDto> {

    protected final BaseService<Entity> service;
    protected final BaseMapper<Entity, Dto, CreateDto, UpdateDto> mapper;

    public BaseController(BaseService<Entity> service, BaseMapper<Entity, Dto, CreateDto, UpdateDto> mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping
    public ResponseEntity<List<Dto>> getAll(@RequestParam Map<String, String> params) throws Exception {
        List<Entity> entities = service.findAll();
        return ResponseEntity.ok(mapper.toDTOsList(entities)); // entity a dto
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dto> getById(@PathVariable String id) throws Exception {
        Entity entity = service.findById(id);
        return ResponseEntity.ok(mapper.toDTO(entity));
    }

    @PostMapping
    public ResponseEntity<Dto> save(@Valid @RequestBody CreateDto createDto) throws Exception {
        Entity entity = mapper.toEntityCreate(createDto); // dto a entity
        Entity savedEntity = service.save(entity);
        return ResponseEntity.ok(mapper.toDTO(savedEntity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Dto> update(@PathVariable String id, @Valid @RequestBody UpdateDto updateDto)
            throws Exception {
        Entity existingEntity = service.findById(id);
        Entity updatedEntity = mapper.toUpdate(existingEntity, updateDto);
        return ResponseEntity.ok(mapper.toDTO(service.update(id, updatedEntity)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) throws Exception {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
