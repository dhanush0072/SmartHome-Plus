package com.smarthome.security;

import java.time.Instant;
import java.util.UUID;

public record SecurityEventResponse(UUID id, String eventType, String description, Instant occurredAt) {
    public static SecurityEventResponse from(SecurityEvent event) {
        return new SecurityEventResponse(event.getId(), event.getEventType(), event.getDescription(), event.getOccurredAt());
    }
}