package com.cm.restaurant_server;

import com.cm.restaurant_server.business.domain.entity.Usuario;
import com.cm.restaurant_server.business.domain.enumeration.Rol;
import com.cm.restaurant_server.business.logic.service.UsuarioService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;


@SpringBootApplication
public class RestaurantServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(RestaurantServerApplication.class, args);
	}

	@Bean
	CommandLineRunner init(UsuarioService userService, PasswordEncoder passwordEncoder) {
		return args -> {
			try {
				String emailAdmin = "admin@restaurant.com";
				if (userService.buscarPorEmail(emailAdmin).isEmpty()) {
					Usuario admin = new Usuario();
					admin.setEmail(emailAdmin);
					admin.setClave("1234");
					admin.setRol(Rol.ADMIN);
					userService.crear(admin);

					System.out.println("Usuario creado");
				}
			} catch (Exception e) {
				System.err.println("Error: " + e.getMessage());
			}
		};
	}
}