package com.smarthome.user;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.smarthome.common.CurrentUser;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/users/me")
public class UserController {
    private final CurrentUser currentUser;

    public UserController(CurrentUser currentUser) {
        this.currentUser = currentUser;
    }

    @GetMapping
    public UserResponse profile() {
        return UserResponse.from(currentUser.get());
    }

    @PatchMapping("/settings")
    public UserResponse updateSettings(@Valid @RequestBody UserSettingsRequest request) {
        UserAccount user = currentUser.get();
        user.updateSettings(request.firstName(), request.lastName(), request.phone(), request.timezone(),
                request.notificationsEnabled());
        return UserResponse.from(user);
    }
}