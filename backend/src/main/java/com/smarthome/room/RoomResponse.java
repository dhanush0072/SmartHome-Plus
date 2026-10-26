package com.smarthome.room;

import java.time.Instant;
import java.util.UUID;

public record RoomResponse(UUID id, String name, String description, String imageUrl, Instant createdAt, Instant updatedAt) {
    public static RoomResponse from(Room room) {
        return new RoomResponse(room.getId(), room.getName(), room.getDescription(), room.getImageUrl(),
                room.getCreatedAt(), room.getUpdatedAt());
    }
}