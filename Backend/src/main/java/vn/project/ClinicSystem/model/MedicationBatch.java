package vn.project.ClinicSystem.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "medication_batches")
public class MedicationBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "medication_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Medication medication;

    @Size(max = 60, message = "Mã lô tối đa 60 ký tự")
    @Column(length = 60)
    private String batchCode;

    @Size(max = 150, message = "Xuất xứ tối đa 150 ký tự")
    @Column(length = 150)
    private String origin;

    private LocalDate manufactureDate;

    private LocalDate expiryDate;

    @NotNull(message = "Đơn giá không được bỏ trống")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Min(value = 0, message = "Tồn kho phải >= 0")
    @Column(nullable = false)
    private Integer quantityOnHand = 0;

    @Min(value = 0, message = "Số hộp phải >= 0")
    private Integer packageCount;

    @Min(value = 1, message = "Số đơn vị mỗi hộp phải >= 1")
    private Integer unitsPerPackage;

    private Instant createdAt;
    private Instant updatedAt;

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
