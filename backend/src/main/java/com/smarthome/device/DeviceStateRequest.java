package com.smarthome.device;

import jakarta.validation.constraints.NotNull;

public record DeviceStateRequest(@NotNull Boolean isOn) {}