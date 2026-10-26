package com.smarthome.feedback;

import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.smarthome.user.UserAccount;

@Service
@Transactional
public class FeedbackService {
    private final FeedbackRepository feedback;

    public FeedbackService(FeedbackRepository feedback) {
        this.feedback = feedback;
    }

    @Transactional(readOnly = true)
    public List<FeedbackResponse> list(UUID ownerId) {
        return feedback.findAllByOwner_IdOrderByCreatedAtDesc(ownerId).stream()
                .map(FeedbackResponse::from).toList();
    }

    public FeedbackResponse create(FeedbackRequest request, UserAccount owner) {
        Feedback entry = new Feedback(request.rating(), request.category(), request.comment());
        entry.setOwner(owner);
        return FeedbackResponse.from(feedback.save(entry));
    }
}