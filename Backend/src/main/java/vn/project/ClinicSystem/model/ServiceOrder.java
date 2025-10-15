package vn.project.ClinicSystem.model;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import vn.project.ClinicSystem.model.enums.ServiceOrderStatus;

@Getter
@Setter
@Entity
@Table(name = "service_orders")
public class ServiceOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "visit_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private PatientVisit visit;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "medical_service_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private MedicalService medicalService;

    @NotNull(message = "Cần chỉ định bác sĩ phụ trách")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assigned_doctor_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Doctor assignedDoctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_by_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Doctor performedBy;

    private LocalDateTime performedAt;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private ServiceOrderStatus status = ServiceOrderStatus.PENDING;

    @Size(max = 500)
    @Column(length = 500)
    private String note;

    @Size(max = 1000)
    @Column(length = 1000)
    private String resultNote;

    @OneToMany(mappedBy = "serviceOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ServiceOrderResult> indicatorResults = new ArrayList<>();

    private Instant createdAt;
    private Instant updatedAt;

    public void addIndicatorResult(ServiceOrderResult result) {
        result.setServiceOrder(this);
        this.indicatorResults.add(result);
    }

    public void clearIndicatorResults() {
        for (ServiceOrderResult result : new ArrayList<>(this.indicatorResults)) {
            result.setServiceOrder(null);
        }
        this.indicatorResults.clear();
    }

    @PrePersist
    public void handleBeforeCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    public void handleBeforeUpdate() {
        this.updatedAt = Instant.now();
    }
}
