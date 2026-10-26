package com.smarthome.security;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.smarthome.common.CurrentUser;
import com.smarthome.user.UserAccount;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/security")
public class SecurityController {
    private final SecurityService securityService;
    private final CurrentUser currentUser;

    public SecurityController(SecurityService securityService, CurrentUser currentUser) {
        this.securityService = securityService;
        this.currentUser = currentUser;
    }

    @GetMapping("/status")
    public SecurityStatusResponse status() {
        return securityService.status(currentUser.get().getId());
    }

    @GetMapping("/events")
    public List<SecurityEventResponse> history() {
        return securityService.history(currentUser.get().getId());
    }

    @PostMapping("/events")
    public ResponseEntity<SecurityEventResponse> record(@Valid @RequestBody SecurityEventRequest request) {
        UserAccount owner = currentUser.get();
        return ResponseEntity.status(HttpStatus.CREATED).body(securityService.record(request, owner));
    }
}