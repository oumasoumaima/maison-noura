package com.maisonnoura.gateway;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import reactor.core.publisher.Mono;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Sécurité de la Gateway : tout ce qui touche à l'écriture (créer/modifier/supprimer des prestations,
 * gérer le statut d'un rendez-vous, lister tous les rendez-vous) exige un token JWT Keycloak avec le
 * rôle réaliste "admin". Les routes publiques (catalogue, créneaux, prise de rendez-vous) restent ouvertes.
 */
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Value("${keycloak.issuer-uri}")
    private String issuerUri;

    @Value("${keycloak.jwk-set-uri}")
    private String jwkSetUri;

    @Bean
    SecurityWebFilterChain filterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(ex -> ex
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // ---- Public : catalogue en lecture, créneaux, prise de rendez-vous ----
                        .pathMatchers(HttpMethod.GET, "/api/categories/**", "/api/prestations/**", "/api/slots").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/appointments").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/appointments/{id}").permitAll()
                        // ---- Réservé à l'équipe (rôle "admin") ----
                        .pathMatchers(HttpMethod.POST, "/api/categories/**", "/api/prestations/**").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/api/categories/**", "/api/prestations/**").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/api/categories/**", "/api/prestations/**").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.GET, "/api/appointments").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PATCH, "/api/appointments/**").hasRole("ADMIN")
                        .anyExchange().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt
                        .jwtDecoder(jwtDecoder())
                        .jwtAuthenticationConverter(jwtAuthenticationConverter())))
                .build();
    }

    /**
     * Les clés de vérification (JWKS) sont récupérées via l'adresse Docker interne "keycloak:8080",
     * jointable depuis ce conteneur. L'"issuer" attendu dans le token, lui, doit correspondre à
     * l'adresse publique "localhost:8090" vue par le navigateur qui a obtenu ce token — d'où
     * la séparation entre jwk-set-uri (récupération des clés) et issuer (validation du champ "iss").
     */
    private ReactiveJwtDecoder jwtDecoder() {
        NimbusReactiveJwtDecoder decoder = NimbusReactiveJwtDecoder.withJwkSetUri(jwkSetUri).build();
        OAuth2TokenValidator<Jwt> validator = new DelegatingOAuth2TokenValidator<>(
                JwtValidators.createDefaultWithIssuer(issuerUri));
        decoder.setJwtValidator(validator);
        return decoder;
    }

    /** Keycloak place les rôles réalistes dans le claim "realm_access.roles" ; on les convertit en "ROLE_xxx". */
    private org.springframework.core.convert.converter.Converter<Jwt, Mono<AbstractAuthenticationToken>> jwtAuthenticationConverter() {
        JwtAuthenticationConverter delegate = new JwtAuthenticationConverter();
        delegate.setJwtGrantedAuthoritiesConverter(this::realmRoleAuthorities);
        return new ReactiveJwtAuthenticationConverterAdapter(delegate);
    }

    @SuppressWarnings("unchecked")
    private Collection<GrantedAuthority> realmRoleAuthorities(Jwt jwt) {
        Map<String, Object> realmAccess = jwt.getClaim("realm_access");
        List<String> roles = realmAccess == null ? List.of() : (List<String>) realmAccess.getOrDefault("roles", List.of());
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                .collect(Collectors.toList());
    }
}
