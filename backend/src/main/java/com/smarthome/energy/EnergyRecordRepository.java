package com.smarthome.energy;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EnergyRecordRepository extends JpaRepository<EnergyRecord, UUID> {
    List<EnergyRecord> findAllByOwner_IdOrderByRecordedAtDesc(UUID ownerId);

    @Query("select coalesce(sum(record.energyKwh), 0) from EnergyRecord record "
            + "where record.owner.id = :ownerId and record.recordedAt >= :from")
    BigDecimal sumSince(@Param("ownerId") UUID ownerId, @Param("from") Instant from);
}