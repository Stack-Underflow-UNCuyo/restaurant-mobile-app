package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.stock.StockCreateDto;
import com.cm.restaurant_server.business.domain.dto.stock.StockDto;
import com.cm.restaurant_server.business.domain.entity.Stock;
import com.cm.restaurant_server.business.logic.service.StockService;
import com.cm.restaurant_server.business.mapper.StockMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/stocks")
public class StockController extends BaseController<Stock, StockDto, StockCreateDto, StockCreateDto> {

    public StockController(StockService service, StockMapper mapper) {
        super(service, mapper);
    }

    @GetMapping("/articulo/{articuloId}")
    public ResponseEntity<List<StockDto>> getAllByArticulo(@PathVariable String articuloId) throws Exception {
        List<Stock> stocks = ((StockService) service).findAllByArticulo(articuloId);
        return ResponseEntity.ok(mapper.toDTOsList(stocks));
    }
}
