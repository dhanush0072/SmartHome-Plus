package com.smarthome.feedback;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record FeedbackRequest(
        @Min(1) @Max(5) int rating,
        @Size(max = 80) String category,
        @Size(max = 2000) String comment) {}