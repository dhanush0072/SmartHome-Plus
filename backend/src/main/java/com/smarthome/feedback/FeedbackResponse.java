package com.smarthome.feedback;

import java.time.Instant;
import java.util.UUID;

public record FeedbackResponse(UUID id, int rating, String category, String comment, Instant createdAt) {
    public static FeedbackResponse from(Feedback feedback) {
        return new FeedbackResponse(feedback.getId(), feedback.getRating(), feedback.getCategory(),
                feedback.getComment(), feedback.getCreatedAt());
    }
}