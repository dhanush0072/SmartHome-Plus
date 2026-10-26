package com.smarthome.automation;

import java.time.Instant;
import java.util.UUID;

public record AutomationRuleResponse(UUID id, String name, String description, boolean enabled, String triggerType,
        String triggerConfig, String actionConfig, Instant createdAt, Instant updatedAt) {
    public static AutomationRuleResponse from(AutomationRule rule) {
        return new AutomationRuleResponse(rule.getId(), rule.getName(), rule.getDescription(), rule.isEnabled(),
                rule.getTriggerType(), rule.getTriggerConfig(), rule.getActionConfig(),
                rule.getCreatedAt(), rule.getUpdatedAt());
    }
}