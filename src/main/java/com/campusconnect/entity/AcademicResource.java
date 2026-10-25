package com.campusconnect.entity;

import jakarta.persistence.*;

/**
 * Academic Resource Entity
 */
@Entity
@Table(name = "academic_resources")
public class AcademicResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 100)
    private String department;

    @Column(nullable = false, length = 50)
    private String semester;

    @Column(nullable = false, length = 20)
    private String format; // PDF, ZIP, etc.

    @Column(name = "file_size", length = 30)
    private String fileSize;

    @Column(length = 100)
    private String author;

    public AcademicResource() {}

    public AcademicResource(String title, String department, String semester, String format, String fileSize, String author) {
        this.title = title;
        this.department = department;
        this.semester = semester;
        this.format = format;
        this.fileSize = fileSize;
        this.author = author;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }

    public String getFileSize() { return fileSize; }
    public void setFileSize(String fileSize) { this.fileSize = fileSize; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
}
