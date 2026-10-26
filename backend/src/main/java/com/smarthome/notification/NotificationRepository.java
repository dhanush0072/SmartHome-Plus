package com.smarthome.notification;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findAllByOwner_IdOrderByCreatedAtDesc(UUID ownerId);
    Optional<Notification> findByIdAndOwner_Id(UUID id, UUID ownerId);
    long countByOwner_IdAndReadAtIsNull(UUID ownerId);
    long countByOwner_Id(UUID ownerId);
}