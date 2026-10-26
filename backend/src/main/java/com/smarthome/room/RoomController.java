package com.smarthome.room;

import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.smarthome.common.CurrentUser;
import com.smarthome.user.UserAccount;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/rooms")
public class RoomController {
    private final RoomService roomService;
    private final CurrentUser currentUser;

    public RoomController(RoomService roomService, CurrentUser currentUser) {
        this.roomService = roomService;
        this.currentUser = currentUser;
    }

    @GetMapping
    public List<RoomResponse> list() {
        return roomService.list(currentUser.get().getId());
    }

    @GetMapping("/{id}")
    public RoomResponse get(@PathVariable UUID id) {
        return roomService.get(id, currentUser.get().getId());
    }

    @PostMapping
    public ResponseEntity<RoomResponse> create(@Valid @RequestBody RoomRequest request) {
        UserAccount owner = currentUser.get();
        return ResponseEntity.status(HttpStatus.CREATED).body(roomService.create(request, owner));
    }

    @PutMapping("/{id}")
    public RoomResponse update(@PathVariable UUID id, @Valid @RequestBody RoomRequest request) {
        return roomService.update(id, request, currentUser.get().getId());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        roomService.delete(id, currentUser.get().getId());
        return ResponseEntity.noContent().build();
    }
}