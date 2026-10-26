package com.smarthome.security;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SecurityEventRequest(
        @NotBlank @Size(max = 80) String eventType,
        @NotBlank @Size(max = 500) String description) {}