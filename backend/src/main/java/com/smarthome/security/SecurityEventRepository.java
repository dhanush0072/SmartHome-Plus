package com.smarthome.security;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SecurityEventRepository extends JpaRepository<SecurityEvent, UUID> {
    List<SecurityEvent> findTop50ByOwner_IdOrderByOccurredAtDesc(UUID ownerId);
    long countByOwner_Id(UUID ownerId);
}