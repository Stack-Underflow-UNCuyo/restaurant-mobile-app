package com.cm.restaurant_server.business.repository;

import com.cm.restaurant_server.business.domain.entity.Base;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import org.springframework.data.domain.Pageable;
import java.io.Serializable;
import java.util.List;
import java.util.Optional;

@NoRepositoryBean
public interface BaseRepository<Entity extends Base> extends JpaRepository<Entity, String> {
  List<Entity> findAllByEliminadoFalse(); // Para obtener solo registros no eliminados

  Optional<Entity> findByIdAndEliminadoFalse(String id); // Para obtener solo registros no eliminados por ID

  Page<Entity> findByEliminadoFalse(Pageable pageable);

  boolean existsByIdAndEliminadoFalse(String id);
}
