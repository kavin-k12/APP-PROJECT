package com.campusconnect.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Lost & Found Item Entity
 */
@Entity
@Table(name = "lost_found_items")
public class LostFoundItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false, length = 50)
    private String category; // Electronics, Keycards, Books, etc.

    @Column(nullable = false, length = 20)
    private String type; // LOST or FOUND

    @Column(nullable = false, length = 100)
    private String location;

    @Column(nullable = false, length = 30)
    private String status = "OPEN"; // OPEN, CLAIMED, RESOLVED

    @Column(name = "date_reported", nullable = false)
    private LocalDate dateReported = LocalDate.now();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reporter_id")
    private Student reporter;

    public LostFoundItem() {}

    public LostFoundItem(String title, String description, String category, String type, String location, String status, LocalDate dateReported, Student reporter) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.type = type;
        this.location = location;
        this.status = status;
        this.dateReported = dateReported;
        this.reporter = reporter;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getDateReported() { return dateReported; }
    public void setDateReported(LocalDate dateReported) { this.dateReported = dateReported; }

    public Student getReporter() { return reporter; }
    public void setReporter(Student reporter) { this.reporter = reporter; }
}
