package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.empleado.EmpleadoCreateDto;
import com.cm.restaurant_server.business.domain.dto.empleado.EmpleadoDto;
import com.cm.restaurant_server.business.domain.entity.Empleado;
import com.cm.restaurant_server.business.logic.service.EmpleadoService;
import com.cm.restaurant_server.business.mapper.EmpleadoMapper;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/empleados")
public class EmpleadoController extends BaseController<Empleado, EmpleadoDto, EmpleadoCreateDto, EmpleadoCreateDto> {

    public EmpleadoController(EmpleadoService service, EmpleadoMapper mapper) {
        super(service, mapper);
    }

}
