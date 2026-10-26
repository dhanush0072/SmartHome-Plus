package com.smarthome.room;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, UUID> {
    List<Room> findAllByOwner_IdOrderByNameAsc(UUID ownerId);
    Optional<Room> findByIdAndOwner_Id(UUID id, UUID ownerId);
    long countByOwner_Id(UUID ownerId);
}