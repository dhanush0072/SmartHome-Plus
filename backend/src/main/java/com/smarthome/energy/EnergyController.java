package com.smarthome.energy;

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
@RequestMapping("/energy")
public class EnergyController {
    private final EnergyService energyService;
    private final CurrentUser currentUser;

    public EnergyController(EnergyService energyService, CurrentUser currentUser) {
        this.energyService = energyService;
        this.currentUser = currentUser;
    }

    @GetMapping("/summary")
    public EnergySummaryResponse summary() {
        return energyService.summary(currentUser.get().getId());
    }

    @GetMapping("/records")
    public List<EnergyRecordResponse> records() {
        return energyService.list(currentUser.get().getId());
    }

    @PostMapping("/records")
    public ResponseEntity<EnergyRecordResponse> create(@Valid @RequestBody EnergyRecordRequest request) {
        UserAccount owner = currentUser.get();
        return ResponseEntity.status(HttpStatus.CREATED).body(energyService.create(request, owner));
    }
}