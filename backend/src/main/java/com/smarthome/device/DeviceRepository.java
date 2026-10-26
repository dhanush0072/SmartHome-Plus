package com.smarthome.device;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceRepository extends JpaRepository<Device, UUID> {
    List<Device> findAllByOwner_IdOrderByCreatedAtDesc(UUID ownerId);
    Optional<Device> findByIdAndOwner_Id(UUID id, UUID ownerId);
    long countByOwner_Id(UUID ownerId);
    long countByOwner_IdAndIsOnTrue(UUID ownerId);
}