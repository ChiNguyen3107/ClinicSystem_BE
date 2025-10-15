package vn.project.ClinicSystem.model;

import java.math.BigDecimal;
import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import vn.project.ClinicSystem.model.enums.BillingItemType;

@Getter
@Setter
@Entity
@Table(name = "billing_items")
public class BillingItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "billing_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler", "items" })
    private Billing billing;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private BillingItemType itemType = BillingItemType.OTHER;

    @Column(length = 180, nullable = false)
    private String description;

    @Min(1)
    @Column(nullable = false)
    private Integer quantity = 1;

    @NotNull
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice = BigDecimal.ZERO;

    @NotNull
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount = BigDecimal.ZERO;

    @Column(name = "service_order_id")
    private Long serviceOrderId;

    @Column(name = "medical_service_id")
    private Long medicalServiceId;

    @Column(name = "prescription_item_id")
    private Long prescriptionItemId;

    @Column(name = "medication_id")
    private Long medicationId;

    @Column(name = "batch_id")
    private Long batchId;

    private Instant createdAt;
    private Instant updatedAt;

    public void recalculateAmount() {
        if (unitPrice != null && quantity != null) {
            this.amount = unitPrice.multiply(BigDecimal.valueOf(quantity.longValue()));
        }
    }

    @PrePersist
    public void handleBeforeCreate() {
        recalculateAmount();
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    public void handleBeforeUpdate() {
        recalculateAmount();
        this.updatedAt = Instant.now();
    }
}
