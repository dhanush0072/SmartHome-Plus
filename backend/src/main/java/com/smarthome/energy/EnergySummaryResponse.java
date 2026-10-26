package com.smarthome.energy;

import java.math.BigDecimal;
import java.time.Instant;

public record EnergySummaryResponse(BigDecimal usageKwh, Instant from, Instant to) {}