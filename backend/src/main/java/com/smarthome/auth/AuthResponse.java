package com.smarthome.auth;

import com.smarthome.user.UserResponse;

public record AuthResponse(String accessToken, String tokenType, long expiresIn, UserResponse user) {}