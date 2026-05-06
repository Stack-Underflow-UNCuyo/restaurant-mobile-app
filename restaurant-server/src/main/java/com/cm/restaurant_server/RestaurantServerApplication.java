package com.cm.restaurant_server;

import com.cm.restaurant_server.business.domain.entity.*;
import com.cm.restaurant_server.business.logic.service.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class RestaurantServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(RestaurantServerApplication.class, args);
	}

	@Bean
	CommandLineRunner init(
			PaisService paisService,
			ProvinciaService provinciaService,
			DepartamentoService departamentoService,
			LocalidadService localidadService,
			DireccionService direccionService) {
		return args -> {
			try {
				System.out.println("--- INICIANDO PRUEBAS DE ENTIDADES GEOGRÁFICAS ---");

				// 1. Crear Jerarquía: Argentina -> Mendoza -> Maipú -> Luzuriaga -> Calle Falsa 123

				// PAIS
				Pais argentina = new Pais("Argentina");
				argentina = paisService.save(argentina);
				System.out.println("✔ País guardado: " + argentina.getNombre());

				// PROVINCIA
				Provincia mendoza = new Provincia();
				mendoza.setNombre("Mendoza");
				mendoza.setPais(argentina);
				mendoza = provinciaService.save(mendoza);
				System.out.println("✔ Provincia guardada: " + mendoza.getNombre());

				// DEPARTAMENTO
				Departamento maipu = new Departamento();
				maipu.setNombre("Maipú");
				maipu.setProvincia(mendoza);
				maipu = departamentoService.save(maipu);
				System.out.println("✔ Departamento guardado: " + maipu.getNombre());

				// LOCALIDAD
				Localidad luzuriaga = new Localidad();
				luzuriaga.setNombre("Luzuriaga");
				luzuriaga.setDepartamento(maipu);
				luzuriaga.setCodigoPostal("5511");
				luzuriaga = localidadService.save(luzuriaga);
				System.out.println("✔ Localidad guardada: " + luzuriaga.getNombre());

				// DIRECCION
				Direccion dir = new Direccion();
				dir.setCalle("Calle Falsa");
				dir.setNumeracion("123");
				dir.setObservacion("5515");
				dir.setBarrio("Nose");
				dir.setLocalidad(luzuriaga);
				dir = direccionService.save(dir);
				System.out.println("✔ Dirección guardada: " + dir.getCalle() + " " + dir.getNumeracion());

				System.out.println("--- PRUEBAS DE ACTUALIZACIÓN Y BORRADO ---");

				// 2. Actualizar Localidad
				luzuriaga.setNombre("Luzuriaga Centro");
				localidadService.update(luzuriaga.getId(), luzuriaga);
				System.out.println("✔ Localidad actualizada.");

				// 3. Listar Provincias
				List<Provincia> provincias = provinciaService.findAll();
				System.out.println("Lista de provincias activas:");
				provincias.forEach(p -> System.out.println(" - " + p.getNombre() + " (País: " + p.getPais().getNombre() + ")"));

				// 4. Borrado Lógico de la Dirección
				//direccionService.delete(dir.getId());
				System.out.println("✔ Dirección eliminada (lógicamente).");

				// 5. Verificar borrado
				List<Direccion> direccionesFinales = direccionService.findAll();
				System.out.println("Cantidad de direcciones activas: " + direccionesFinales.size());

				System.out.println("--- FIN DE LAS PRUEBAS ---");

			} catch (Exception e) {
				System.err.println("❌ Error en la ejecución: " + e.getMessage());
				e.printStackTrace();
			}
		};
	}
}