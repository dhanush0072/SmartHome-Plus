package com.smarthome.automation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AutomationRuleRequest(
        @NotBlank @Size(max = 160) String name,
        @Size(max = 500) String description,
        @NotNull Boolean enabled,
        @NotBlank @Size(max = 80) String triggerType,
        @Size(max = 4000) String triggerConfig,
        @NotBlank @Size(max = 4000) String actionConfig) {}