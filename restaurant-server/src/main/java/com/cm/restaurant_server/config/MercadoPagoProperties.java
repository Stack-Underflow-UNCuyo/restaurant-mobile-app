package com.cm.restaurant_server.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de la integración con Mercado Pago.
 * Se completa desde application.properties (prefijo "mercado-pago"), con valores
 * por defecto de prueba sobreescribibles por variables de entorno.
 */
@Getter
@Setter
@Configuration
@ConfigurationProperties("mercado-pago")
public class MercadoPagoProperties {
    /** Base de la API de Mercado Pago (ej. https://api.mercadopago.com). */
    private String baseUrl;
    /** Access Token (Bearer) de la aplicación de Mercado Pago. */
    private String accessToken;
    /** User ID de la cuenta vendedora (collector) en Mercado Pago. */
    private String userId;
}
