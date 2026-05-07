package com.cm.restaurant_server.controllers;

import com.cm.restaurant_server.business.domain.dto.autenticacion.LoginRequest;
import com.cm.restaurant_server.business.domain.dto.autenticacion.LoginResponse;
import com.cm.restaurant_server.business.logic.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/auth/login")
    public LoginResponse login(@RequestBody @Validated LoginRequest request) {
        return authService.attemptLogin(request.getEmail(), request.getClave());
    }
}