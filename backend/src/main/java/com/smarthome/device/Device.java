package com.smarthome.device;

import com.smarthome.common.OwnedEntity;
import com.smarthome.room.Room;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "devices")
public class Device extends OwnedEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 80)
    private String type;

    @Column(name = "is_on", nullable = false)
    private boolean isOn;

    @Column(name = "state_json", columnDefinition = "TEXT")
    private String stateJson = "{}";

    protected Device() {}

    public Device(Room room, String name, String type) {
        this.room = room;
        this.name = name;
        this.type = type;
    }

    public void updateState(boolean isOn) { this.isOn = isOn; }
    public Room getRoom() { return room; }
    public String getName() { return name; }
    public String getType() { return type; }
    public boolean isOn() { return isOn; }
}