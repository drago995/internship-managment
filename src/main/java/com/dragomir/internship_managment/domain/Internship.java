package com.dragomir.internship_managment.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode(exclude = {"company", "applications"})
@ToString(exclude = {"company", "applications"})
@Entity
@Table(name = "internships")
public class Internship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InternshipStatus status = InternshipStatus.PENDING;
    @Column(nullable = false, length = 255)
    private String title;

    @Column(length = 3000, nullable = false)
    private String description;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "available_positions", nullable = false)
    private Integer availablePositions;

    @Column(name = "filled_positions")
    private Integer filledPositions = 0;

    @Column(length = 2000)
    private String requirements;

    @Column(length = 2000)
    private String responsibilities;

    @Column(length = 255)
    private String location;

    @Column(name = "is_remote")
    private Boolean isRemote = false;

    @Column(name = "is_paid")
    private Boolean isPaid = false;

    @Column
    private Double salary;

    @Column(name = "duration_weeks")
    private Integer durationWeeks;

    @Column(length = 500)
    private String skills;

    @Column(length = 100)
    private String category;



    @Column(name = "deadline")
    private LocalDate deadline;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @JsonIgnore
    @OneToMany(mappedBy = "internship", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Application> applications = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (filledPositions == null) {
            filledPositions = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }


    public void addApplication(Application application) {
        applications.add(application);
        application.setInternship(this);
    }

    public void removeApplication(Application application) {
        applications.remove(application);
        application.setInternship(null);
    }

    public boolean hasAvailablePositions() {
        return filledPositions < availablePositions;
    }

    public int getRemainingPositions() {
        return availablePositions - filledPositions;
    }

    public boolean isExpired() {
        return deadline != null && LocalDate.now().isAfter(deadline);
    }

    public int getApplicationsCount() {
        return applications.size();
    }


}

