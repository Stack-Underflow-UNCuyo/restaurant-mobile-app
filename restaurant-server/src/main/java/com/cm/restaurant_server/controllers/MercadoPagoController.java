package com.cm.restaurant_server.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cm.restaurant_server.business.domain.dto.mercadopago.CajaCreateDto;
import com.cm.restaurant_server.business.domain.dto.mercadopago.CajaDto;
import com.cm.restaurant_server.business.domain.dto.mercadopago.EstadoOrdenDto;
import com.cm.restaurant_server.business.domain.dto.mercadopago.OrdenCreateDto;
import com.cm.restaurant_server.business.domain.dto.mercadopago.OrdenDto;
import com.cm.restaurant_server.business.domain.dto.mercadopago.SucursalCreateDto;
import com.cm.restaurant_server.business.domain.dto.mercadopago.SucursalDto;
import com.cm.restaurant_server.business.domain.dto.mercadopago.SyncResultDto;
import com.cm.restaurant_server.business.logic.service.MercadoPagoService;

/**
 * Endpoints de la integración con Mercado Pago
 * La creación de sucursal/caja es setup de admin; los GET son de lectura para
 * cualquier usuario autenticado 
 */
@RestController
@RequestMapping("/api/v1/mercadopago")
public class MercadoPagoController {

    private final MercadoPagoService service;

    public MercadoPagoController(MercadoPagoService service) {
        this.service = service;
    }

    @PostMapping("/sucursal")
    public ResponseEntity<SucursalDto> crearSucursal(@RequestBody SucursalCreateDto dto) throws Exception {
        return ResponseEntity.ok(SucursalDto.from(service.crearSucursal(dto)));
    }

    @PostMapping("/caja")
    public ResponseEntity<CajaDto> crearCaja(@RequestBody CajaCreateDto dto) throws Exception {
        return ResponseEntity.ok(CajaDto.from(service.crearCaja(dto)));
    }

    @PostMapping("/sync")
    public ResponseEntity<SyncResultDto> sync() throws Exception {
        return ResponseEntity.ok(service.syncDesdeMercadoPago());
    }

    @GetMapping("/sucursales")
    public ResponseEntity<List<SucursalDto>> listarSucursales() {
        return ResponseEntity.ok(service.listarSucursales().stream().map(SucursalDto::from).toList());
    }

    @GetMapping("/cajas")
    public ResponseEntity<List<CajaDto>> listarCajas() {
        return ResponseEntity.ok(service.listarCajas().stream().map(CajaDto::from).toList());
    }

    @PostMapping("/orders")
    public ResponseEntity<OrdenDto> crearOrden(@RequestBody OrdenCreateDto dto) throws Exception {
        return ResponseEntity.ok(service.crearOrden(dto));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrdenDto>> listarOrdenes() {
        return ResponseEntity.ok(service.listarOrdenes().stream().map(OrdenDto::from).toList());
    }

    @PostMapping("/orders/{id}/confirmar-pago")
    public ResponseEntity<EstadoOrdenDto> confirmarPago(@PathVariable String id) throws Exception {
        return ResponseEntity.ok(service.confirmarPago(id));
    }
}
