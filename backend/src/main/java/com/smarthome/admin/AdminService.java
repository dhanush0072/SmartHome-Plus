package com.smarthome.admin;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.smarthome.device.DeviceRepository;
import com.smarthome.room.RoomRepository;
import com.smarthome.user.UserRepository;
import com.smarthome.user.UserResponse;

@Service
@Transactional(readOnly = true)
public class AdminService {
    private final UserRepository users;
    private final RoomRepository rooms;
    private final DeviceRepository devices;

    public AdminService(UserRepository users, RoomRepository rooms, DeviceRepository devices) {
        this.users = users;
        this.rooms = rooms;
        this.devices = devices;
    }

    public AdminOverview overview() {
        return new AdminOverview(users.count(), rooms.count(), devices.count());
    }

    public Page<UserResponse> users(Pageable pageable) {
        return users.findAll(pageable).map(UserResponse::from);
    }
}