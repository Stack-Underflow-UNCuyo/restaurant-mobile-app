package com.cm.restaurant_server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Provee el cliente HTTP saliente que usa MercadoPagoService para hablar con la
 * API de Mercado Pago. Es el único RestTemplate del proyecto; el token de
 * autorización se adjunta por header en cada llamada, no acá.
 */
@Configuration
public class MercadoPagoConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
