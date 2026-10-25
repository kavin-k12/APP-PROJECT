package com.campusconnect.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Announcement / Campus Notice Entity
 */
@Entity
@Table(name = "announcements")
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "announcement_date", nullable = false)
    private LocalDate date = LocalDate.now();

    @Column(nullable = false, length = 1500)
    private String content;

    public Announcement() {}

    public Announcement(String title, String category, LocalDate date, String content) {
        this.title = title;
        this.category = category;
        this.date = date;
        this.content = content;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
