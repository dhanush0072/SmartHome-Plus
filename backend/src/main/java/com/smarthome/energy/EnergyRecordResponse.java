package com.smarthome.energy;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record EnergyRecordResponse(UUID id, UUID deviceId, BigDecimal energyKwh, Instant recordedAt) {
    public static EnergyRecordResponse from(EnergyRecord record) {
        return new EnergyRecordResponse(record.getId(),
                record.getDevice() == null ? null : record.getDevice().getId(),
                record.getEnergyKwh(), record.getRecordedAt());
    }
}