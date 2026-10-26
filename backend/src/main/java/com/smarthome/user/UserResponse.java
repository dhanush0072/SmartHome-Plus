package com.smarthome.user;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String firstName,
        String lastName,
        String phone,
        String timezone,
        boolean notificationsEnabled,
        UserRole role,
        Instant createdAt) {
    public static UserResponse from(UserAccount user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(),
                user.getPhone(), user.getTimezone(), user.isNotificationsEnabled(), user.getRole(), user.getCreatedAt());
    }
}