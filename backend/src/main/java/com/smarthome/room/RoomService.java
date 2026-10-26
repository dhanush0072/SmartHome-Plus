package com.smarthome.room;

import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.smarthome.common.NotFoundException;
import com.smarthome.user.UserAccount;

@Service
@Transactional
public class RoomService {
    private final RoomRepository rooms;

    public RoomService(RoomRepository rooms) {
        this.rooms = rooms;
    }

    @Transactional(readOnly = true)
    public List<RoomResponse> list(UUID ownerId) {
        return rooms.findAllByOwner_IdOrderByNameAsc(ownerId).stream().map(RoomResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public RoomResponse get(UUID id, UUID ownerId) {
        return RoomResponse.from(requireRoom(id, ownerId));
    }

    public RoomResponse create(RoomRequest request, UserAccount owner) {
        Room room = new Room(request.name().trim(), request.description(), request.imageUrl());
        room.setOwner(owner);
        return RoomResponse.from(rooms.save(room));
    }

    public RoomResponse update(UUID id, RoomRequest request, UUID ownerId) {
        Room room = requireRoom(id, ownerId);
        room.update(request.name().trim(), request.description(), request.imageUrl());
        return RoomResponse.from(room);
    }

    public void delete(UUID id, UUID ownerId) {
        rooms.delete(requireRoom(id, ownerId));
    }

    private Room requireRoom(UUID id, UUID ownerId) {
        return rooms.findByIdAndOwner_Id(id, ownerId).orElseThrow(() -> new NotFoundException("Room"));
    }
}