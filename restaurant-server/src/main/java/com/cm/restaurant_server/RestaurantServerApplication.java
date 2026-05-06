package com.cm.restaurant_server;

import com.cm.restaurant_server.business.domain.entity.Pais;
import com.cm.restaurant_server.business.logic.service.PaisService;
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
	CommandLineRunner init(PaisService paisService) {
		return args -> {
			try {
				System.out.println("Iniciando sistema...");

				/*
				Pais p1 = new Pais("Argentina");
				Pais p2 = new Pais("Chile");
				Pais p3 = new Pais("Uruguay");

				p1 = paisService.save(p1);
				p2 = paisService.save(p2);
				p3 = paisService.save(p3);
				System.out.println("Países creados.");

				// 2. Listar todos
				List<Pais> listaInicial = paisService.findAll();
				System.out.println("Lista inicial: " + listaInicial.size() + " países.");

				// 3. Actualizar uno (usando el ID generado por UUID)
				p2.setNombre("Chile Actualizado");
				paisService.update(p2.getId(), p2);
				System.out.println("País actualizado: " + p2.getNombre());

				// 4. Eliminar uno (Borrado lógico)
				// Eliminamos Uruguay (p3)
				paisService.delete(p3.getId());
				System.out.println("País eliminado: " + p3.getNombre());

				// 5. Listar nuevamente para ver los cambios
				// El método findAll ya filtra por eliminado=false
				List<Pais> listaFinal = paisService.findAll();
				System.out.println("Lista final (solo activos):");
				listaFinal.forEach(p -> System.out.println(" - " + p.getNombre()));
				 */

			} catch (Exception e) {
				System.err.println("Error en la ejecución: " + e.getMessage());
			}
		};
	}

}
