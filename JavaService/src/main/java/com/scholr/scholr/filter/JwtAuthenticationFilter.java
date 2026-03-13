package com.scholr.scholr.filter;

import com.scholr.scholr.service.JwtService;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Value("${JWT_SECRET}")
    private String secretKey;

    @Override
    protected void doFilterInternal(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        String path = request.getServletPath();

        log.info("PATH: {}", request.getServletPath());

        if (path.equals("/api/v1/auth/refresh")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract JWT from "Authorization" header
        final String authHeader = request.getHeader("Authorization");

        log.info("Authorization header: {}", authHeader);

        // If header is missing OR does not start with " Bearer ", skip and continue the filter chain
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract JWT Token
        final String token = authHeader.substring(7);

        try {
            // Extract username from token
            final String userName = jwtService.extractUserCollegeId(token);

            // Check if user is not already authenticated
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (userName != null && authentication == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(userName);

                // Validate token
                if (jwtService.isTokenValid(token, userDetails)) {

                    // check if user is verified
                    Boolean isVerified = (Boolean) jwtService.extractAllClaims(token, secretKey).get("is_verified");
                    if (isVerified == null || !isVerified) {
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.setContentType("application/json");
                        response.getWriter().write("{\"status\":403 ,\"error\":\"Account not verified\",\"message\":\"Please verify your email.\"}");
                        return;
                    }

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    // Attach request details
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Store authentication in context
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }

            }
            // Continue filter chain
            filterChain.doFilter(request, response);
        }catch (io.jsonwebtoken.ExpiredJwtException e) {
            log.error("JWT Token expired: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"success\":false, \"message\":\"TOKEN_EXPIRED\"}");
        } catch (Exception e) {
            log.error("JWT Authentication failed: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.getWriter().write("{\"success\":false, \"message\":\"Invalid Token\"}");
        }
    }
}
