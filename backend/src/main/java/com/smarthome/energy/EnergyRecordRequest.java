package com.smarthome.energy;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record EnergyRecordRequest(UUID deviceId, @NotNull @Positive BigDecimal energyKwh, Instant recordedAt) {}