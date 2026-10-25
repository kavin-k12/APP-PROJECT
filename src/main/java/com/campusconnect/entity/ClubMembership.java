package com.campusconnect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Club Membership Record
 */
@Entity
@Table(name = "club_memberships", uniqueConstraints = {
    @UniqueConstraint(name = "uk_club_student", columnNames = {"club_id", "student_id"})
})
public class ClubMembership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "join_statement", length = 500)
    private String joinStatement;

    @Column(nullable = false, length = 30)
    private String status = "PENDING"; // "PENDING", "APPROVED", "REJECTED"

    @Column(name = "request_date", nullable = false)
    private LocalDateTime requestDate = LocalDateTime.now();

    public ClubMembership() {}

    public ClubMembership(Club club, Student student, String joinStatement) {
        this.club = club;
        this.student = student;
        this.joinStatement = joinStatement;
        this.status = "PENDING";
        this.requestDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Club getClub() { return club; }
    public void setClub(Club club) { this.club = club; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public String getJoinStatement() { return joinStatement; }
    public void setJoinStatement(String joinStatement) { this.joinStatement = joinStatement; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getRequestDate() { return requestDate; }
    public void setRequestDate(LocalDateTime requestDate) { this.requestDate = requestDate; }
}
