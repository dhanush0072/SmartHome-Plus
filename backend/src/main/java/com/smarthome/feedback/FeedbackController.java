package com.smarthome.feedback;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.smarthome.common.CurrentUser;
import com.smarthome.user.UserAccount;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {
    private final FeedbackService feedbackService;
    private final CurrentUser currentUser;

    public FeedbackController(FeedbackService feedbackService, CurrentUser currentUser) {
        this.feedbackService = feedbackService;
        this.currentUser = currentUser;
    }

    @GetMapping
    public List<FeedbackResponse> list() {
        return feedbackService.list(currentUser.get().getId());
    }

    @PostMapping
    public ResponseEntity<FeedbackResponse> create(@Valid @RequestBody FeedbackRequest request) {
        UserAccount owner = currentUser.get();
        return ResponseEntity.status(HttpStatus.CREATED).body(feedbackService.create(request, owner));
    }
}