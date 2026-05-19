package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.ReservaMesa;

import java.util.List;

import org.springframework.stereotype.Repository;

@Repository
public interface ReservaMesaRepository extends BaseRepository<ReservaMesa> {
    List<ReservaMesa> findByNombreApellidoClienteContainingIgnoreCase(String nombreApellidoCliente);
}
