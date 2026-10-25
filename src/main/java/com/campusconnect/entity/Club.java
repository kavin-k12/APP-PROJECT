package com.campusconnect.entity;

import jakarta.persistence.*;

/**
 * Club / Student Guild Entity
 */
@Entity
@Table(name = "clubs")
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String name;

    @Column(nullable = false, length = 60)
    private String category;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(name = "lead_name", length = 100)
    private String leadName;

    @Column(name = "member_count", nullable = false)
    private int memberCount = 0;

    @Column(name = "meeting_schedule", length = 100)
    private String meetingSchedule;

    @Column(length = 10)
    private String icon = "🚀";

    public Club() {}

    public Club(String name, String category, String description, String leadName, int memberCount, String meetingSchedule, String icon) {
        this.name = name;
        this.category = category;
        this.description = description;
        this.leadName = leadName;
        this.memberCount = memberCount;
        this.meetingSchedule = meetingSchedule;
        this.icon = icon;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLeadName() { return leadName; }
    public void setLeadName(String leadName) { this.leadName = leadName; }

    public int getMemberCount() { return memberCount; }
    public void setMemberCount(int memberCount) { this.memberCount = memberCount; }

    public String getMeetingSchedule() { return meetingSchedule; }
    public void setMeetingSchedule(String meetingSchedule) { this.meetingSchedule = meetingSchedule; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
