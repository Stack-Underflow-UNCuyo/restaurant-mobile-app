package com.cm.restaurant_server.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    private static final String[] ADMIN_MANAGED_PATHS = {
            "/api/v1/articulos/**",
            "/api/v1/categorias/**",
            "/api/v1/menus/**",
            "/api/v1/detalles-menu/**",
            "/api/v1/cartas/**",
            "/api/v1/secciones-carta/**",
            "/api/v1/detalles-seccion-carta/**",
            "/api/v1/detalles-seccion-carta-articulo/**",
            "/api/v1/detalles-seccion-carta-menu/**",
            "/api/v1/formas-de-pago/**",
            "/api/v1/unidades-de-medida/**",
            "/api/v1/paises/**",
            "/api/v1/provincias/**",
            "/api/v1/departamentos/**",
            "/api/v1/localidades/**",
            "/api/v1/promociones/**",
            "/api/v1/imagenes/**",
            "/api/v1/stocks/**",
            "/api/v1/movimientos-stock/**"
    };

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain applicationSecurity(HttpSecurity http) throws Exception {
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf((csrf) -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .securityMatcher("/**")
                .authorizeHttpRequests(registry -> registry
                        // Public
                        .requestMatchers("/auth/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/cartas/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/secciones-carta/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/empresa").permitAll()

                        // Any authenticated user: own profile
                        .requestMatchers(HttpMethod.GET, "/api/v1/usuarios/me").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/usuarios/me").authenticated()

                        // Admin-only (all methods)
                        .requestMatchers("/api/v1/usuarios/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/v1/empleados/me").authenticated()
                        .requestMatchers("/api/v1/empleados/**").hasRole("ADMIN")

                        // Catalog/config: admin writes, any auth reads
                        .requestMatchers(HttpMethod.POST, ADMIN_MANAGED_PATHS).hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, ADMIN_MANAGED_PATHS).hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, ADMIN_MANAGED_PATHS).hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/empresa/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/empresa/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/empresa/**").hasRole("ADMIN")

                        // Mercado Pago: la creación de sucursal/caja es setup de admin.
                        // Los GET (y los futuros endpoints de cobro del mozo) quedan
                        // accesibles para cualquier usuario autenticado (PERSONAL).
                        .requestMatchers(HttpMethod.POST, "/api/v1/mercadopago/sucursal", "/api/v1/mercadopago/caja", "/api/v1/mercadopago/sync").hasRole("ADMIN")

                        // ── Everything else: any logged-in user ──────────────────────────
                        .anyRequest().authenticated());
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Cualquier puerto de localhost: dashboard (3000) y la web de Expo de la app
        // movil.
        config.setAllowedOriginPatterns(List.of("http://localhost:*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authManagerBuilder
                .userDetailsService(customUserDetailsService)
                .passwordEncoder(passwordEncoder());
        return authManagerBuilder.build();
    }
}