package com.smarthome.security;

import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.smarthome.user.UserAccount;

@Service
@Transactional
public class SecurityService {
    private final SecurityEventRepository events;

    public SecurityService(SecurityEventRepository events) {
        this.events = events;
    }

    @Transactional(readOnly = true)
    public List<SecurityEventResponse> history(UUID ownerId) {
        return events.findTop50ByOwner_IdOrderByOccurredAtDesc(ownerId).stream()
                .map(SecurityEventResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public SecurityStatusResponse status(UUID ownerId) {
        List<SecurityEvent> recent = events.findTop50ByOwner_IdOrderByOccurredAtDesc(ownerId);
        SecurityEvent latest = recent.isEmpty() ? null : recent.getFirst();
        boolean alert = latest != null && latest.getEventType().equalsIgnoreCase("ALERT");
        return new SecurityStatusResponse(alert ? "ALERT" : "SECURE", events.countByOwner_Id(ownerId),
                latest == null ? null : SecurityEventResponse.from(latest));
    }

    public SecurityEventResponse record(SecurityEventRequest request, UserAccount owner) {
        SecurityEvent event = new SecurityEvent(request.eventType().trim(), request.description().trim());
        event.setOwner(owner);
        return SecurityEventResponse.from(events.save(event));
    }
}