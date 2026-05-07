package com.cm.restaurant_server.business.domain.dto.autenticacion;

import lombok.Getter;

@Getter
public class LoginRequest {
    private String email;
    private String clave;
}