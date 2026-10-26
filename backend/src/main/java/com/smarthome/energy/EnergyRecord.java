package com.smarthome.energy;

import java.math.BigDecimal;
import java.time.Instant;
import com.smarthome.common.OwnedEntity;
import com.smarthome.device.Device;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "energy_records")
public class EnergyRecord extends OwnedEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id")
    private Device device;

    @Column(name = "energy_kwh", nullable = false, precision = 12, scale = 4)
    private BigDecimal energyKwh;

    @Column(name = "recorded_at", nullable = false)
    private Instant recordedAt;

    protected EnergyRecord() {}

    public EnergyRecord(Device device, BigDecimal energyKwh, Instant recordedAt) {
        this.device = device;
        this.energyKwh = energyKwh;
        this.recordedAt = recordedAt == null ? Instant.now() : recordedAt;
    }

    public Device getDevice() { return device; }
    public BigDecimal getEnergyKwh() { return energyKwh; }
    public Instant getRecordedAt() { return recordedAt; }
}