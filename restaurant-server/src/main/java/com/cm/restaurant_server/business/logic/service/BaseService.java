package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.entity.Base;
import com.cm.restaurant_server.business.repository.BaseRepository;
import jakarta.transaction.Transactional;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;


public abstract class BaseService<Entity extends Base, ID extends Serializable> {
    protected BaseRepository<Entity> baseRepository;

    public BaseService(BaseRepository<Entity> baseRepository) {
        this.baseRepository = baseRepository;
    }

    @Transactional
    public List<Entity> findAll() throws Exception {
        try {
            // Filtrar para devolver solo los registros que no están eliminados
            List<Entity> entities = baseRepository.findAllByEliminadoFalse();
            return entities;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Transactional
    public Entity findById(String id) throws Exception {
        try {
            // Verificar si el registro está marcado como eliminado
            Optional<Entity> entityOptional = baseRepository.findByIdAndEliminadoFalse(id);
            return entityOptional.orElseThrow(() -> new Exception("Entity not found or marked as deleted"));
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Transactional
    public Entity save(Entity entity) throws Exception {
        try {
            entity = baseRepository.save(entity);
            return entity;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Transactional
    public Entity update(String id, Entity entity) throws Exception {
        try {
            if (baseRepository.existsByIdAndEliminadoFalse(id)) {
                entity.setId((String) id); // Aseguramos que el ID sea el correcto
                return baseRepository.save(entity);
            } else {
                throw new Exception("Entity not found or marked as deleted");
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Transactional
    public boolean delete(String id) throws Exception {
        try {
            Optional<Entity> entityOptional = baseRepository.findByIdAndEliminadoFalse(id);
            if (entityOptional.isPresent()) {
                Entity entityToDelete = entityOptional.get();
                // Marcar como eliminado en lugar de borrarlo físicamente
                entityToDelete.setEliminado(true);
                baseRepository.save(entityToDelete);
                return true;
            } else {
                throw new Exception("Entity not found or already marked as deleted");
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }
}
