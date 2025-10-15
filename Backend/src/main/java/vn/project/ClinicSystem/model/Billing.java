package vn.project.ClinicSystem.model;

import java.math.BigDecimal;
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
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import vn.project.ClinicSystem.model.enums.BillingStatus;

@Getter
@Setter
@Entity
@Table(name = "billings")
public class Billing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "visit_id", nullable = false, unique = true)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler", "serviceOrders", "prescriptions", "billing" })
    private PatientVisit visit;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Patient patient;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private BillingStatus status = BillingStatus.UNPAID;

    @Column(nullable = false)
    private BigDecimal serviceTotal = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal medicationTotal = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal otherTotal = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(length = 60)
    private String paymentMethod;

    @Column(length = 255)
    private String notes;

    @NotNull
    private LocalDateTime issuedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "billing", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BillingItem> items = new ArrayList<>();

    private Instant createdAt;
    private Instant updatedAt;

    public void addItem(BillingItem item) {
        item.setBilling(this);
        items.add(item);
    }

    public void clearItems() {
        for (BillingItem item : new ArrayList<>(items)) {
            item.setBilling(null);
        }
        items.clear();
    }

    public void recalculateTotals() {
        BigDecimal service = BigDecimal.ZERO;
        BigDecimal medication = BigDecimal.ZERO;
        BigDecimal other = BigDecimal.ZERO;

        for (BillingItem item : items) {
            if (item.getAmount() == null) {
                continue;
            }
            switch (item.getItemType()) {
                case SERVICE -> service = service.add(item.getAmount());
                case MEDICATION -> medication = medication.add(item.getAmount());
                case OTHER -> other = other.add(item.getAmount());
                default -> {
                    other = other.add(item.getAmount());
                }
            }
        }

        this.serviceTotal = service;
        this.medicationTotal = medication;
        this.otherTotal = other;
        this.totalAmount = service.add(medication).add(other);
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
