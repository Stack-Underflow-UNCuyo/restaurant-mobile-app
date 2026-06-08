package com.cm.restaurant_server.business.logic.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cm.restaurant_server.business.domain.entity.Imagen;
import com.cm.restaurant_server.business.repository.ImagenRepository;

@Service
public class ImagenService extends BaseService<Imagen> {
    @Autowired
    public ImagenService(ImagenRepository repository) {
        super(repository);
    }

    @Override
    protected void validar(Imagen entity, CasoValidar caso) throws Exception {
        if (entity.getNombre() == null || entity.getNombre().isBlank()) {
            throw new Exception("El nombre de la imagen es obligatorio");
        }

        if (entity.getMime() == null || entity.getMime().isBlank()) {
            throw new Exception("El tipo MIME de la imagen es obligatorio");
        }

        if (entity.getUrl() == null || entity.getUrl().isBlank()) {
            throw new Exception("La imagen es obligatoria");
        }

        if (entity.getTipoImagen() == null) {
            throw new Exception("El tipo de imagen es obligatorio");
        }
    }

    @org.springframework.transaction.annotation.Transactional
    public Imagen crearImagenLocal(com.cm.restaurant_server.business.domain.dto.imagen.ImagenCreateDto dto) throws Exception {
        if (dto == null || dto.getContenido() == null || dto.getContenido().length == 0) {
            return null;
        }
        
        String nombreArchivo = java.util.UUID.randomUUID().toString() + "_" + dto.getNombre().replaceAll("[^a-zA-Z0-9.-]", "_");
        java.nio.file.Path ruta = java.nio.file.Paths.get("uploads").resolve(nombreArchivo);
        if (!java.nio.file.Files.exists(ruta.getParent())) {
            java.nio.file.Files.createDirectories(ruta.getParent());
        }
        java.nio.file.Files.write(ruta, dto.getContenido());
        
        Imagen imagen = new Imagen();
        imagen.setNombre(dto.getNombre());
        imagen.setMime(dto.getMime());
        imagen.setTipoImagen(dto.getTipoImagen());
        imagen.setUrl("/images/" + nombreArchivo);
        
        return save(imagen);
    }
}
