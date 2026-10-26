package com.smarthome.automation;

import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.smarthome.common.NotFoundException;
import com.smarthome.user.UserAccount;

@Service
@Transactional
public class AutomationService {
    private final AutomationRuleRepository rules;

    public AutomationService(AutomationRuleRepository rules) {
        this.rules = rules;
    }

    @Transactional(readOnly = true)
    public List<AutomationRuleResponse> list(UUID ownerId) {
        return rules.findAllByOwner_IdOrderByCreatedAtDesc(ownerId).stream()
                .map(AutomationRuleResponse::from).toList();
    }

    public AutomationRuleResponse create(AutomationRuleRequest request, UserAccount owner) {
        AutomationRule rule = new AutomationRule(request.name().trim(), request.description(), request.enabled(),
                request.triggerType().trim(), request.triggerConfig(), request.actionConfig());
        rule.setOwner(owner);
        return AutomationRuleResponse.from(rules.save(rule));
    }

    public AutomationRuleResponse update(UUID id, AutomationRuleRequest request, UUID ownerId) {
        AutomationRule rule = requireRule(id, ownerId);
        rule.update(request.name().trim(), request.description(), request.enabled(),
                request.triggerType().trim(), request.triggerConfig(), request.actionConfig());
        return AutomationRuleResponse.from(rule);
    }

    public void delete(UUID id, UUID ownerId) {
        rules.delete(requireRule(id, ownerId));
    }

    private AutomationRule requireRule(UUID id, UUID ownerId) {
        return rules.findByIdAndOwner_Id(id, ownerId).orElseThrow(() -> new NotFoundException("Automation rule"));
    }
}