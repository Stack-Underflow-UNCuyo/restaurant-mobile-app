package com.cm.restaurant_server;

import com.cm.restaurant_server.business.domain.entity.*;
import com.cm.restaurant_server.business.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class DataInitializer implements CommandLineRunner {

    private final PaisRepository paisRepo;
    private final ProvinciaRepository provinciaRepo;
    private final DepartamentoRepository departamentoRepo;
    private final LocalidadRepository localidadRepo;

    public DataInitializer(
            PaisRepository paisRepo,
            ProvinciaRepository provinciaRepo,
            DepartamentoRepository departamentoRepo,
            LocalidadRepository localidadRepo) {
        this.paisRepo = paisRepo;
        this.provinciaRepo = provinciaRepo;
        this.departamentoRepo = departamentoRepo;
        this.localidadRepo = localidadRepo;
    }

    @Override
    @SuppressWarnings("null")
    public void run(String... args) {
        if (paisRepo.existsByNombreAndEliminadoFalse("Argentina")) return;

        Pais argentina = paisRepo.save(pais("Argentina"));

        Provincia mendoza = provinciaRepo.save(provincia("Mendoza", argentina));

        // Departamentos de Mendoza con sus localidades
        Map<String, List<String[]>> data = Map.of(
            "Capital", List.of(
                new String[]{"Mendoza", "5500"},
                new String[]{"Ciudad de Mendoza", "5501"}
            ),
            "Godoy Cruz", List.of(
                new String[]{"Godoy Cruz", "5501"},
                new String[]{"Las Tortugas", "5503"}
            ),
            "Guaymallén", List.of(
                new String[]{"Guaymallén", "5521"},
                new String[]{"El Algarrobal", "5519"},
                new String[]{"Buena Nueva", "5522"}
            ),
            "Maipú", List.of(
                new String[]{"Maipú", "5515"},
                new String[]{"Lunlunta", "5517"},
                new String[]{"Russell", "5516"}
            ),
            "Luján de Cuyo", List.of(
                new String[]{"Luján de Cuyo", "5507"},
                new String[]{"Vistalba", "5509"},
                new String[]{"Chacras de Coria", "5505"}
            ),
            "Las Heras", List.of(
                new String[]{"Las Heras", "5539"},
                new String[]{"El Challao", "5539"},
                new String[]{"El Algarrobal", "5539"}
            ),
            "San Martín", List.of(
                new String[]{"San Martín", "5570"},
                new String[]{"Palmira", "5572"}
            ),
            "Junín", List.of(
                new String[]{"Junín", "5571"},
                new String[]{"La Colonia", "5573"}
            )
        );

        for (Map.Entry<String, List<String[]>> entry : data.entrySet()) {
            Departamento depto = departamentoRepo.save(departamento(entry.getKey(), mendoza));
            for (String[] loc : entry.getValue()) {
                localidadRepo.save(localidad(loc[0], loc[1], depto));
            }
        }
    }

    private Pais pais(String nombre) {
        Pais p = new Pais();
        p.setNombre(nombre);
        return p;
    }

    private Provincia provincia(String nombre, Pais pais) {
        Provincia p = new Provincia();
        p.setNombre(nombre);
        p.setPais(pais);
        return p;
    }

    private Departamento departamento(String nombre, Provincia provincia) {
        Departamento d = new Departamento();
        d.setNombre(nombre);
        d.setProvincia(provincia);
        return d;
    }

    private Localidad localidad(String nombre, String cp, Departamento departamento) {
        Localidad l = new Localidad();
        l.setNombre(nombre);
        l.setCodigoPostal(cp);
        l.setDepartamento(departamento);
        return l;
    }
}
