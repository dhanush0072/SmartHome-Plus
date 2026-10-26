package com.smarthome.automation;

import com.smarthome.common.OwnedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "automation_rules")
public class AutomationRule extends OwnedEntity {
    @Column(nullable = false, length = 160)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private boolean enabled = true;

    @Column(name = "trigger_type", nullable = false, length = 80)
    private String triggerType;

    @Column(name = "trigger_config", columnDefinition = "TEXT")
    private String triggerConfig;

    @Column(name = "action_config", nullable = false, columnDefinition = "TEXT")
    private String actionConfig;

    protected AutomationRule() {}

    public AutomationRule(String name, String description, boolean enabled, String triggerType,
            String triggerConfig, String actionConfig) {
        update(name, description, enabled, triggerType, triggerConfig, actionConfig);
    }

    public void update(String name, String description, boolean enabled, String triggerType,
            String triggerConfig, String actionConfig) {
        this.name = name;
        this.description = description;
        this.enabled = enabled;
        this.triggerType = triggerType;
        this.triggerConfig = triggerConfig;
        this.actionConfig = actionConfig;
    }

    public String getName() { return name; }
    public String getDescription() { return description; }
    public boolean isEnabled() { return enabled; }
    public String getTriggerType() { return triggerType; }
    public String getTriggerConfig() { return triggerConfig; }
    public String getActionConfig() { return actionConfig; }
}