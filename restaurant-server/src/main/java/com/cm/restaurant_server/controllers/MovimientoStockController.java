package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.movimientostock.MovimientoStockCreateDto;
import com.cm.restaurant_server.business.domain.dto.movimientostock.MovimientoStockDto;
import com.cm.restaurant_server.business.domain.entity.MovimientoStock;
import com.cm.restaurant_server.business.logic.service.MovimientoStockService;
import com.cm.restaurant_server.business.mapper.MovimientoStockMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/movimientos-stock")
public class MovimientoStockController extends BaseController<MovimientoStock, MovimientoStockDto, MovimientoStockCreateDto, MovimientoStockCreateDto> {

    public MovimientoStockController(MovimientoStockService service, MovimientoStockMapper mapper) {
        super(service, mapper);
    }
}
