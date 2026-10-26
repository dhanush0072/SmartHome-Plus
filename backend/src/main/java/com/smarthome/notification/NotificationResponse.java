package com.smarthome.notification;

import java.time.Instant;
import java.util.UUID;

public record NotificationResponse(UUID id, String title, String message, Instant readAt, Instant createdAt) {
    public static NotificationResponse from(Notification notification) {
        return new NotificationResponse(notification.getId(), notification.getTitle(), notification.getMessage(),
                notification.getReadAt(), notification.getCreatedAt());
    }
}