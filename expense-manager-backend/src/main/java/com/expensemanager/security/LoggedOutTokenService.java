package com.expensemanager.security;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class LoggedOutTokenService {

    private final Set<String> loggedOutTokens =
            ConcurrentHashMap.newKeySet();

    /**
     * Mark a JWT token as logged out.
     */
    public void logout(String token) {

        if (token != null && !token.isBlank()) {
            loggedOutTokens.add(token);
        }
    }

    /**
     * Check whether a JWT has already been logged out.
     */
    public boolean isLoggedOut(String token) {

        return loggedOutTokens.contains(token);
    }
}