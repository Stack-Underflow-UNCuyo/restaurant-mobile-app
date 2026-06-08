package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.empleado.EmpleadoCreateDto;
import com.cm.restaurant_server.business.domain.dto.empleado.EmpleadoDto;
import com.cm.restaurant_server.business.domain.entity.Empleado;
import com.cm.restaurant_server.business.domain.entity.Usuario;
import com.cm.restaurant_server.business.logic.service.EmpleadoService;
import com.cm.restaurant_server.business.logic.service.UsuarioService;
import com.cm.restaurant_server.business.mapper.EmpleadoMapper;
import com.cm.restaurant_server.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/empleados")
public class EmpleadoController extends BaseController<Empleado, EmpleadoDto, EmpleadoCreateDto, EmpleadoCreateDto> {

    @Autowired
    private UsuarioService usuarioService;

    public EmpleadoController(EmpleadoService service, EmpleadoMapper mapper) {
        super(service, mapper);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(Authentication authentication) {
        try {
            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
            Usuario usuario = usuarioService.findById(principal.getUserId());
            if (usuario.getPersona() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("{\"error\":\"No hay empleado asociado a este usuario.\"}");
            }
            Empleado empleado = service.findById(usuario.getPersona().getId());
            return ResponseEntity.ok(mapper.toDTO(empleado));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\":\"Error. Por favor intente más tarde.\"}");
        }
    }

}
