package com.smarthome.common;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import com.smarthome.user.UserAccount;
import com.smarthome.user.UserRepository;

@Component
public class CurrentUser {
    private final UserRepository users;

    public CurrentUser(UserRepository users) {
        this.users = users;
    }

    public UserAccount get() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof JwtAuthenticationToken jwtAuthentication) {
            return users.findByEmailIgnoreCase(jwtAuthentication.getToken().getSubject())
                    .orElseThrow(() -> new NotFoundException("User"));
        }
        throw new IllegalStateException("Authenticated user is unavailable.");
    }
}