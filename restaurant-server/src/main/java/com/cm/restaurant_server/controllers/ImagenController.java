package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.imagen.ImagenCreateDto;
import com.cm.restaurant_server.business.domain.dto.imagen.ImagenDto;
import com.cm.restaurant_server.business.domain.entity.Imagen;
import com.cm.restaurant_server.business.logic.service.ImagenService;
import com.cm.restaurant_server.business.mapper.ImagenMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/imagenes")
public class ImagenController extends BaseController<Imagen, ImagenDto, ImagenCreateDto, ImagenCreateDto> {

    public ImagenController(ImagenService service, ImagenMapper mapper) {
        super(service, mapper);
    }
}
