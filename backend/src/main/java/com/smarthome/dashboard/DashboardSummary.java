package com.smarthome.dashboard;

import java.math.BigDecimal;

public record DashboardSummary(
        long rooms,
        long devices,
        long activeDevices,
        long enabledAutomations,
        long unreadNotifications,
        BigDecimal energyUsageKwhLast30Days) {}