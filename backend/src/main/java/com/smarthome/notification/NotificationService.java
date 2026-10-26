package com.smarthome.notification;

import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.smarthome.common.NotFoundException;

@Service
@Transactional
public class NotificationService {
    private final NotificationRepository notifications;

    public NotificationService(NotificationRepository notifications) {
        this.notifications = notifications;
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> list(UUID ownerId) {
        return notifications.findAllByOwner_IdOrderByCreatedAtDesc(ownerId).stream()
                .map(NotificationResponse::from).toList();
    }

    public NotificationResponse markRead(UUID id, UUID ownerId) {
        Notification notification = notifications.findByIdAndOwner_Id(id, ownerId)
                .orElseThrow(() -> new NotFoundException("Notification"));
        notification.markRead();
        return NotificationResponse.from(notification);
    }
}