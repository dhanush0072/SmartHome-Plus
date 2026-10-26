package com.smarthome.energy;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.smarthome.common.NotFoundException;
import com.smarthome.device.Device;
import com.smarthome.device.DeviceRepository;
import com.smarthome.user.UserAccount;

@Service
@Transactional
public class EnergyService {
    private final EnergyRecordRepository records;
    private final DeviceRepository devices;

    public EnergyService(EnergyRecordRepository records, DeviceRepository devices) {
        this.records = records;
        this.devices = devices;
    }

    @Transactional(readOnly = true)
    public List<EnergyRecordResponse> list(UUID ownerId) {
        return records.findAllByOwner_IdOrderByRecordedAtDesc(ownerId).stream()
                .map(EnergyRecordResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public EnergySummaryResponse summary(UUID ownerId) {
        Instant to = Instant.now();
        Instant from = to.minus(30, ChronoUnit.DAYS);
        BigDecimal usage = records.sumSince(ownerId, from);
        return new EnergySummaryResponse(usage == null ? BigDecimal.ZERO : usage, from, to);
    }

    public EnergyRecordResponse create(EnergyRecordRequest request, UserAccount owner) {
        Device device = null;
        if (request.deviceId() != null) {
            device = devices.findByIdAndOwner_Id(request.deviceId(), owner.getId())
                    .orElseThrow(() -> new NotFoundException("Device"));
        }
        EnergyRecord record = new EnergyRecord(device, request.energyKwh(), request.recordedAt());
        record.setOwner(owner);
        return EnergyRecordResponse.from(records.save(record));
    }
}