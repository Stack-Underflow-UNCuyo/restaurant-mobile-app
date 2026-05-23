package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.usuario.UsuarioCreateDto;
import com.cm.restaurant_server.business.domain.dto.usuario.UsuarioDto;
import com.cm.restaurant_server.business.domain.entity.Usuario;
import com.cm.restaurant_server.business.logic.service.BaseService;
import com.cm.restaurant_server.business.logic.service.UsuarioService;
import com.cm.restaurant_server.business.mapper.BaseMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/v1/usuarios")
public class UsuarioController extends BaseController<Usuario, UsuarioDto, UsuarioCreateDto, UsuarioCreateDto> {

    @Autowired
    protected UsuarioService usuarioService;

    public UsuarioController(BaseService<Usuario> service, BaseMapper<Usuario, UsuarioDto, UsuarioCreateDto, UsuarioCreateDto> mapper) {
        super(service, mapper);
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crearUsuario(@RequestBody UsuarioCreateDto usuarioDto) {
        try {
            Usuario usuarioEntity = mapper.toEntityCreate(usuarioDto);
            return ResponseEntity.status(HttpStatus.OK).body(mapper.toDTO(usuarioService.crear(usuarioEntity)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/buscar/{nombre}")
    public ResponseEntity<?> getOne(@PathVariable String nombre) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(usuarioService.searchByCuenta(nombre));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\":\"Error. Por favor intente más tarde.\"}");
        }
    }

    @GetMapping("/buscarId/{idUsuario}")
    public ResponseEntity<?> buscarPorIdUsuario(@PathVariable String idUsuario) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(usuarioService.findById(idUsuario));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\":\"Error. Por favor intente más tarde.\"}");
        }
    }

    /*@GetMapping("/buscar/per/{idUsuario}")
    public ResponseEntity<?> getPorPersonaId(@PathVariable String idUsuario) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(usuarioService.searchByIdPersona(idUsuario));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\":\"Error. Por favor intente más tarde.\"}");
        }
    }

     */

}
