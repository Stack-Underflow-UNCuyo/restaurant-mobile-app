package com.cm.restaurant_server.business.logic.service;

import com.cm.restaurant_server.business.domain.dto.autenticacion.LoginResponse;
import com.cm.restaurant_server.security.JwtIssuer;
import com.cm.restaurant_server.security.UserPrincipal;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtIssuer jwtIssuer;
    private final AuthenticationManager authenticationManager;

    public LoginResponse attemptLogin(String email, String password) {
        try {
            var authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            var principal = (UserPrincipal) authentication.getPrincipal();

            var roles = principal.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();

            var token = jwtIssuer.issue(principal.getUserId(), principal.getEmail(), roles);
            return LoginResponse.builder()
                    .accessToken(token)
                    .build();
        } catch (BadCredentialsException e) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email o contraseña incorrectos");
        }
    }
}
