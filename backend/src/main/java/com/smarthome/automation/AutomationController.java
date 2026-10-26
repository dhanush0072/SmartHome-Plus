package com.smarthome.automation;

import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.smarthome.common.CurrentUser;
import com.smarthome.user.UserAccount;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/automation")
public class AutomationController {
    private final AutomationService automationService;
    private final CurrentUser currentUser;

    public AutomationController(AutomationService automationService, CurrentUser currentUser) {
        this.automationService = automationService;
        this.currentUser = currentUser;
    }

    @GetMapping
    public List<AutomationRuleResponse> list() {
        return automationService.list(currentUser.get().getId());
    }

    @PostMapping
    public ResponseEntity<AutomationRuleResponse> create(@Valid @RequestBody AutomationRuleRequest request) {
        UserAccount owner = currentUser.get();
        return ResponseEntity.status(HttpStatus.CREATED).body(automationService.create(request, owner));
    }

    @PutMapping("/{id}")
    public AutomationRuleResponse update(@PathVariable UUID id, @Valid @RequestBody AutomationRuleRequest request) {
        return automationService.update(id, request, currentUser.get().getId());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        automationService.delete(id, currentUser.get().getId());
        return ResponseEntity.noContent().build();
    }
}