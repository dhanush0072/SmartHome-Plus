package com.smarthome.device;

import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.smarthome.common.NotFoundException;
import com.smarthome.room.Room;
import com.smarthome.room.RoomRepository;
import com.smarthome.user.UserAccount;

@Service
@Transactional
public class DeviceService {
    private final DeviceRepository devices;
    private final RoomRepository rooms;

    public DeviceService(DeviceRepository devices, RoomRepository rooms) {
        this.devices = devices;
        this.rooms = rooms;
    }

    @Transactional(readOnly = true)
    public List<DeviceResponse> list(UUID ownerId) {
        return devices.findAllByOwner_IdOrderByCreatedAtDesc(ownerId).stream().map(DeviceResponse::from).toList();
    }

    public DeviceResponse create(DeviceRequest request, UserAccount owner) {
        Room room = rooms.findByIdAndOwner_Id(request.roomId(), owner.getId())
                .orElseThrow(() -> new NotFoundException("Room"));
        Device device = new Device(room, request.name().trim(), request.type().trim());
        device.setOwner(owner);
        return DeviceResponse.from(devices.save(device));
    }

    public DeviceResponse updateState(UUID id, DeviceStateRequest request, UUID ownerId) {
        Device device = devices.findByIdAndOwner_Id(id, ownerId)
                .orElseThrow(() -> new NotFoundException("Device"));
        device.updateState(request.isOn());
        return DeviceResponse.from(device);
    }
}