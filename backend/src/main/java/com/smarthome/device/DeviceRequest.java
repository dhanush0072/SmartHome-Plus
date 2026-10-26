package com.smarthome.device;

import java.util.UUID;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DeviceRequest(
        @NotNull UUID roomId,
        @NotBlank @Size(max = 120) String name,
        @NotBlank @Size(max = 80) String type) {}