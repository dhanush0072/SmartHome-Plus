package com.smarthome.feedback;

import com.smarthome.common.OwnedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "feedback")
public class Feedback extends OwnedEntity {
    @Column(nullable = false)
    private int rating;

    @Column(length = 80)
    private String category;

    @Column(length = 2000)
    private String comment;

    protected Feedback() {}

    public Feedback(int rating, String category, String comment) {
        this.rating = rating;
        this.category = category;
        this.comment = comment;
    }

    public int getRating() { return rating; }
    public String getCategory() { return category; }
    public String getComment() { return comment; }
}