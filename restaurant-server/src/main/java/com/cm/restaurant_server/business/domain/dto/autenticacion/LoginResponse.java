package com.cm.restaurant_server.business.domain.dto.autenticacion;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {
    private final String accessToken;
}
