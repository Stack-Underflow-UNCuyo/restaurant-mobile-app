package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Carta;
import com.cm.restaurant_server.business.domain.entity.SeccionCarta;
import com.cm.restaurant_server.business.repository.CartaRepository;
import com.cm.restaurant_server.business.repository.SeccionCartaRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collection;

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

    private void validar(String idSeccionCarta, LocalDate fechaDesde, LocalDate fechaHasta) throws Exception {
        if (idSeccionCarta == null || idSeccionCarta.isBlank()) {
            throw new Exception("El id de la sección de la carta es obligatorio");
        }
        if (fechaDesde == null) {
            throw new Exception("La fecha de inicio de la carta es obligatoria");
        }
        if (fechaHasta == null) {
            throw new Exception("La fecha de fin de la carta es obligatoria");
        }
        if (fechaHasta.isBefore(fechaDesde)) {
            throw new Exception("La fecha de fin no puede ser anterior a la fecha de inicio");
        }
    }

    @Transactional
    public void crearCarta(String idSeccionCarta, LocalDate fechaDesde, LocalDate fechaHasta) throws Exception {
        validar(idSeccionCarta, fechaDesde, fechaHasta);
        SeccionCarta seccionCarta = seccionCartaRepository.findByIdAndEliminadoFalse(idSeccionCarta)
                .orElseThrow(() -> new Exception("Sección de la carta no encontrada con id: " + idSeccionCarta));
        Carta carta = new Carta();
        carta.setSeccionCarta(seccionCarta);
        carta.setFechaDesde(fechaDesde);
        carta.setFechaHasta(fechaHasta);
        save(carta);
    }

    @Transactional
    public Carta buscarCarta(String id) throws Exception {
        return findById(id);
    }

    @Transactional
    public void modificarCarta(String id, String idSeccionCarta, LocalDate fechaDesde, LocalDate fechaHasta) throws Exception {
        validar(idSeccionCarta, fechaDesde, fechaHasta);
        SeccionCarta seccionCarta = seccionCartaRepository.findByIdAndEliminadoFalse(idSeccionCarta)
                .orElseThrow(() -> new Exception("Sección de la carta no encontrada con id: " + idSeccionCarta));
        Carta carta = findById(id);
        carta.setSeccionCarta(seccionCarta);
        carta.setFechaDesde(fechaDesde);
        carta.setFechaHasta(fechaHasta);
        update(id, carta);
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
