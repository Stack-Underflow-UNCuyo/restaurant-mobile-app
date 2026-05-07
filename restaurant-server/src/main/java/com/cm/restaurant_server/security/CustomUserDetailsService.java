package com.cm.restaurant_server.security;

import com.cm.restaurant_server.business.logic.error.ErrorServiceException;
import com.cm.restaurant_server.business.logic.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UsuarioService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            var user = userService.buscarPorEmail(username).orElseThrow();
            List<GrantedAuthority> permisos = new ArrayList();
            GrantedAuthority p = new SimpleGrantedAuthority("ROLE_" + user.getRol().toString());
            permisos.add(p);
            return UserPrincipal.builder()
                    .userId(user.getId())
                    .email(user.getEmail())
                    .authorities(permisos)
                    .password(user.getClave())
                    .build();

        } catch (ErrorServiceException e) {
            throw new RuntimeException(e);
        }
    }
}