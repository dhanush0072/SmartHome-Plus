package com.smarthome.user;

import jakarta.validation.constraints.Size;

public record UserSettingsRequest(
        @Size(min = 1, max = 100) String firstName,
        @Size(min = 1, max = 100) String lastName,
        @Size(max = 40) String phone,
        @Size(max = 80) String timezone,
        Boolean notificationsEnabled) {}