package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.comanda.ComandaRestaurantCreateDto;
import com.cm.restaurant_server.business.domain.dto.comanda.ComandaRestaurantDto;
import com.cm.restaurant_server.business.domain.dto.detallecomanda.DetalleComandaCreateDto;
import com.cm.restaurant_server.business.domain.dto.detallecomanda.DetalleComandaDto;
import com.cm.restaurant_server.business.domain.entity.Cliente;
import com.cm.restaurant_server.business.domain.entity.ComandaRestaurant;
import com.cm.restaurant_server.business.domain.enumeration.EstadoComanda;
import com.cm.restaurant_server.business.domain.entity.DetalleComanda;
import com.cm.restaurant_server.business.domain.entity.Empleado;
import com.cm.restaurant_server.business.logic.service.ClienteService;
import com.cm.restaurant_server.business.logic.service.ComandaRestaurantService;
import com.cm.restaurant_server.business.logic.service.ComandaService;
import com.cm.restaurant_server.business.logic.service.DetalleComandaService;
import com.cm.restaurant_server.business.logic.service.DetalleSeccionCartaService;
import com.cm.restaurant_server.business.logic.service.EmpleadoService;
import com.cm.restaurant_server.business.logic.service.MesaRestauranteService;
import com.cm.restaurant_server.business.mapper.ComandaRestaurantMapper;
import com.cm.restaurant_server.business.mapper.DetalleComandaMapper;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/comandas-restaurant")
public class ComandaRestaurantController
        extends BaseController<ComandaRestaurant, ComandaRestaurantDto, ComandaRestaurantCreateDto, ComandaRestaurantCreateDto> {

    private final ComandaService comandaService;
    private final DetalleComandaService detalleComandaService;
    private final DetalleComandaMapper detalleComandaMapper;
    private final DetalleSeccionCartaService detalleSeccionCartaService;
    private final ClienteService clienteService;
    private final EmpleadoService empleadoService;
    private final MesaRestauranteService mesaRestauranteService;

    public ComandaRestaurantController(ComandaRestaurantService service, ComandaRestaurantMapper mapper,
            ComandaService comandaService,
            DetalleComandaService detalleComandaService, DetalleComandaMapper detalleComandaMapper,
            DetalleSeccionCartaService detalleSeccionCartaService,
            ClienteService clienteService, EmpleadoService empleadoService,
            MesaRestauranteService mesaRestauranteService) {
        super(service, mapper);
        this.comandaService = comandaService;
        this.detalleComandaService = detalleComandaService;
        this.detalleComandaMapper = detalleComandaMapper;
        this.detalleSeccionCartaService = detalleSeccionCartaService;
        this.clienteService = clienteService;
        this.empleadoService = empleadoService;
        this.mesaRestauranteService = mesaRestauranteService;
    }

    @Override
    public ResponseEntity<ComandaRestaurantDto> save(@Valid @RequestBody ComandaRestaurantCreateDto createDto)
            throws Exception {
        ComandaRestaurant entity = ((ComandaRestaurantMapper) mapper).toEntityCreate(createDto);
        entity.setFechaSolicitudComanda(LocalDateTime.now());
        entity.setFechaEntregaComanda(null);
        entity.setEstadoComanda(EstadoComanda.ABIERTA);
        resolveRelations(entity, createDto);
        ComandaRestaurant saved = service.save(entity);
        return ResponseEntity.ok(((ComandaRestaurantMapper) mapper).toDTO(saved));
    }

    @Override
    public ResponseEntity<ComandaRestaurantDto> update(@PathVariable String id,
            @Valid @RequestBody ComandaRestaurantCreateDto updateDto) throws Exception {
        ComandaRestaurant existing = (ComandaRestaurant) service.findById(id);
        if (existing.getEstadoComanda() == EstadoComanda.FINALIZADA
                || existing.getEstadoComanda() == EstadoComanda.ANULADA
                || existing.getEstadoComanda() == EstadoComanda.ENTREGA_FALLIDA) {
            throw new Exception("No se puede modificar una comanda en estado " + existing.getEstadoComanda());
        }
        EstadoComanda estadoAnterior = existing.getEstadoComanda();
        ((ComandaRestaurantMapper) mapper).toUpdate(existing, updateDto);
        resolveRelations(existing, updateDto);
        if (estadoAnterior != EstadoComanda.FINALIZADA && existing.getEstadoComanda() == EstadoComanda.FINALIZADA) {
            existing.setFechaEntregaComanda(LocalDateTime.now());
        }
        ComandaRestaurant updated = service.update(id, existing);
        return ResponseEntity.ok(((ComandaRestaurantMapper) mapper).toDTO(updated));
    }

    private void resolveRelations(ComandaRestaurant entity, ComandaRestaurantCreateDto dto) throws Exception {
        if (dto.getClienteId() != null && !dto.getClienteId().isBlank()) {
            entity.setCliente(clienteService.findById(dto.getClienteId()));
        } else {
            entity.setCliente(null);
        }
        if (dto.getEmpleadoId() != null && !dto.getEmpleadoId().isBlank()) {
            entity.setEmpleado(empleadoService.findById(dto.getEmpleadoId()));
        } else {
            entity.setEmpleado(null);
        }
        if (dto.getMesaRestauranteId() != null && !dto.getMesaRestauranteId().isBlank()) {
            entity.setMesaRestaurante(mesaRestauranteService.findById(dto.getMesaRestauranteId()));
        } else {
            entity.setMesaRestaurante(null);
        }
    }

    @GetMapping("/mesa/{mesaId}")
    public ResponseEntity<List<ComandaRestaurantDto>> getAllByMesa(@PathVariable String mesaId) {
        List<ComandaRestaurant> comandas = ((ComandaRestaurantService) service).findAllByMesa(mesaId);
        return ResponseEntity.ok(((ComandaRestaurantMapper) mapper).toDTOsList(comandas));
    }

    @GetMapping("/{id}/detalles")
    public ResponseEntity<List<DetalleComandaDto>> getDetalles(@PathVariable String id) throws Exception {
        List<DetalleComanda> detalles = comandaService.listarDetalleComanda(id);
        return ResponseEntity.ok(detalleComandaMapper.toDTOsList(detalles));
    }

    @PostMapping("/{id}/detalles")
    public ResponseEntity<DetalleComandaDto> addDetalle(@PathVariable String id,
            @Valid @RequestBody DetalleComandaCreateDto dto) throws Exception {
        dto.setComandaId(id);
        DetalleComanda entity = detalleComandaMapper.toEntityCreate(dto);
        entity.setComanda(comandaService.findById(id));
        entity.setDetalleSeccionCarta(detalleSeccionCartaService.buscarDetalleSeccionCarta(dto.getDetalleSeccionCartaId()));
        DetalleComanda saved = detalleComandaService.save(entity);
        return ResponseEntity.ok(detalleComandaMapper.toDTO(saved));
    }

    @PutMapping("/{id}/detalles/{detalleId}")
    public ResponseEntity<DetalleComandaDto> updateDetalle(@PathVariable String id, @PathVariable String detalleId,
            @Valid @RequestBody DetalleComandaCreateDto dto) throws Exception {
        dto.setComandaId(id);
        DetalleComanda existing = detalleComandaService.findById(detalleId);
        detalleComandaMapper.toUpdate(existing, dto);
        existing.setDetalleSeccionCarta(detalleSeccionCartaService.buscarDetalleSeccionCarta(dto.getDetalleSeccionCartaId()));
        DetalleComanda updated = detalleComandaService.update(detalleId, existing);
        return ResponseEntity.ok(detalleComandaMapper.toDTO(updated));
    }

    @DeleteMapping("/{id}/detalles/{detalleId}")
    public ResponseEntity<Void> deleteDetalle(@PathVariable String id, @PathVariable String detalleId) throws Exception {
        detalleComandaService.delete(detalleId);
        return ResponseEntity.noContent().build();
    }
}
