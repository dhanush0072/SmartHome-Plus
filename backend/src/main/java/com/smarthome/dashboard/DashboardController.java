package com.smarthome.dashboard;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.math.BigDecimal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.smarthome.automation.AutomationRuleRepository;
import com.smarthome.common.CurrentUser;
import com.smarthome.device.DeviceRepository;
import com.smarthome.energy.EnergyRecordRepository;
import com.smarthome.notification.NotificationRepository;
import com.smarthome.room.RoomRepository;
import com.smarthome.user.UserAccount;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {
    private final CurrentUser currentUser;
    private final RoomRepository rooms;
    private final DeviceRepository devices;
    private final AutomationRuleRepository automations;
    private final NotificationRepository notifications;
    private final EnergyRecordRepository energy;

    public DashboardController(CurrentUser currentUser, RoomRepository rooms, DeviceRepository devices,
            AutomationRuleRepository automations, NotificationRepository notifications, EnergyRecordRepository energy) {
        this.currentUser = currentUser;
        this.rooms = rooms;
        this.devices = devices;
        this.automations = automations;
        this.notifications = notifications;
        this.energy = energy;
    }

    @GetMapping
    public DashboardSummary summary() {
        UserAccount user = currentUser.get();
        Instant from = Instant.now().minus(30, ChronoUnit.DAYS);
        BigDecimal usage = energy.sumSince(user.getId(), from);
        return new DashboardSummary(
                rooms.countByOwner_Id(user.getId()),
                devices.countByOwner_Id(user.getId()),
                devices.countByOwner_IdAndIsOnTrue(user.getId()),
                automations.countByOwner_IdAndEnabledTrue(user.getId()),
                notifications.countByOwner_IdAndReadAtIsNull(user.getId()),
                usage == null ? BigDecimal.ZERO : usage);
    }
}