package com.smarthome.security;

import java.time.Instant;
import com.smarthome.common.OwnedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "security_events")
public class SecurityEvent extends OwnedEntity {
    @Column(name = "event_type", nullable = false, length = 80)
    private String eventType;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(name = "occurred_at", nullable = false)
    private Instant occurredAt;

    protected SecurityEvent() {}

    public SecurityEvent(String eventType, String description) {
        this.eventType = eventType;
        this.description = description;
        this.occurredAt = Instant.now();
    }

    public String getEventType() { return eventType; }
    public String getDescription() { return description; }
    public Instant getOccurredAt() { return occurredAt; }
}