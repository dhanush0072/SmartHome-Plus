package com.smarthome.device;

import java.time.Instant;
import java.util.UUID;

public record DeviceResponse(UUID id, UUID roomId, String roomName, String name, String type,
        boolean isOn, Instant createdAt, Instant updatedAt) {
    public static DeviceResponse from(Device device) {
        return new DeviceResponse(device.getId(), device.getRoom().getId(), device.getRoom().getName(),
                device.getName(), device.getType(), device.isOn(), device.getCreatedAt(), device.getUpdatedAt());
    }
}