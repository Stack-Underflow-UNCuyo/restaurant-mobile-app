package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.categoria.CategoriaCreateDto;
import com.cm.restaurant_server.business.domain.dto.categoria.CategoriaDto;
import com.cm.restaurant_server.business.domain.entity.Categoria;
import com.cm.restaurant_server.business.logic.service.CategoriaService;
import com.cm.restaurant_server.business.mapper.CategoriaMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/categorias")
public class CategoriaController extends BaseController<Categoria, CategoriaDto, CategoriaCreateDto, CategoriaCreateDto> {

    public CategoriaController(CategoriaService service, CategoriaMapper mapper) {
        super(service, mapper);
    }

    @GetMapping("/todos")
    public ResponseEntity<Collection<CategoriaDto>> getTodos() {
        Collection<Categoria> categorias = ((CategoriaService) service).listarCategoria();
        return ResponseEntity.ok(categorias.stream().map(mapper::toDTO).collect(Collectors.toList()));
    }

    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<CategoriaDto> getByNombre(@PathVariable String nombre) throws Exception {
        Categoria categoria = ((CategoriaService) service).buscarCategoriaPorNombre(nombre);
        return ResponseEntity.ok(mapper.toDTO(categoria));
    }
}
