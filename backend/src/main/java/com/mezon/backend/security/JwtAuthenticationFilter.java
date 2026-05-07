package com.mezon.backend.security;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.mezon.backend.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
        System.out.println("JwtAuthenticationFilter CREATED");

    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);
        System.out.println("Hello" + authorization);
        if (authorization != null
                && authorization.startsWith(BEARER_PREFIX)
                && SecurityContextHolder.getContext().getAuthentication() == null) {
            String token = authorization.substring(BEARER_PREFIX.length()).trim();
            System.out.println("token" + token);
            jwtService.parseAccessToken(token).ifPresent(claims -> authenticate(request, claims));
        }

        filterChain.doFilter(request, response);
    }

    private void authenticate(HttpServletRequest request, JwtClaims claims) {
        AuthenticatedUserPrincipal principal = new AuthenticatedUserPrincipal(
                claims.userId(),
                claims.username(),
                claims.email());

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                principal,
                null,
                List.of(new SimpleGrantedAuthority("ROLE_USER")));
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
