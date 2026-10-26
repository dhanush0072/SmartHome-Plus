package com.smarthome.security;

public record SecurityStatusResponse(String status, long eventCount, SecurityEventResponse latestEvent) {}