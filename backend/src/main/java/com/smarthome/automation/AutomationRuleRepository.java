package com.smarthome.automation;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AutomationRuleRepository extends JpaRepository<AutomationRule, UUID> {
    List<AutomationRule> findAllByOwner_IdOrderByCreatedAtDesc(UUID ownerId);
    Optional<AutomationRule> findByIdAndOwner_Id(UUID id, UUID ownerId);
    long countByOwner_IdAndEnabledTrue(UUID ownerId);
}