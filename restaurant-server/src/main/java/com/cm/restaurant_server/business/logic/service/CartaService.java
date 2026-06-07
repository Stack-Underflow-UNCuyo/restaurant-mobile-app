package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Carta;
import com.cm.restaurant_server.business.domain.entity.SeccionCarta;
import com.cm.restaurant_server.business.repository.CartaRepository;
import com.cm.restaurant_server.business.repository.SeccionCartaRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
public class CartaService extends BaseService<Carta> {

    private final CartaRepository repository;
    private final SeccionCartaRepository seccionCartaRepository;

    @Autowired
    public CartaService(CartaRepository repository, SeccionCartaRepository seccionCartaRepository) {
        super(repository);
        this.repository = repository;
        this.seccionCartaRepository = seccionCartaRepository;
    }

    @Override
    protected void validar(Carta entity, CasoValidar caso) throws Exception {
        if (entity.getFechaDesde() == null) {
            throw new Exception("La fecha de inicio de la carta es obligatoria");
        }
        if (entity.getFechaHasta() == null) {
            throw new Exception("La fecha de fin de la carta es obligatoria");
        }
        if (entity.getFechaHasta().isBefore(entity.getFechaDesde())) {
            throw new Exception("La fecha de fin no puede ser anterior a la fecha de inicio");
        }
    }

    private List<SeccionCarta> buscarSeccionesCarta(List<String> ids) throws Exception {
        if (ids == null || ids.isEmpty()) {
            return new ArrayList<>();
        }
        List<SeccionCarta> secciones = new ArrayList<>();
        for (String id : ids) {
            SeccionCarta seccion = seccionCartaRepository.findByIdAndEliminadoFalse(id)
                    .orElseThrow(() -> new Exception("Sección de la carta no encontrada con id: " + id));
            secciones.add(seccion);
        }
        return secciones;
    }

    @Transactional
    public Carta crearCarta(String nombre, List<String> seccionCartaIds, LocalDate fechaDesde, LocalDate fechaHasta) throws Exception {
        Carta carta = new Carta();
        carta.setNombre(nombre);
        carta.setFechaDesde(fechaDesde);
        carta.setFechaHasta(fechaHasta);
        carta.setSeccionesCarta(buscarSeccionesCarta(seccionCartaIds));
        return save(carta);
    }

    @Transactional
    public Carta buscarCarta(String id) throws Exception {
        return findById(id);
    }

    @Transactional
    public Carta modificarCarta(String id, String nombre, List<String> seccionCartaIds, LocalDate fechaDesde, LocalDate fechaHasta) throws Exception {
        Carta carta = findById(id);
        carta.setNombre(nombre);
        carta.setFechaDesde(fechaDesde);
        carta.setFechaHasta(fechaHasta);
        carta.setSeccionesCarta(buscarSeccionesCarta(seccionCartaIds));
        return update(id, carta);
    }

    @Transactional
    public void eliminarCarta(String id) throws Exception {
        delete(id);
    }

    @Transactional
    public Collection<Carta> listarCarta() {
        return repository.findAll();
    }

    @Transactional
    public Collection<Carta> listarCartaActivo() {
        return repository.findAllByEliminadoFalse();
    }
}
