package vn.project.ClinicSystem.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "medications")
public class Medication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tên thuốc không được để trống")
    @Size(max = 150, message = "Tên thuốc tối đa 150 ký tự")
    @Column(nullable = false, length = 150, unique = true)
    private String name;

    @Size(max = 150, message = "Hoạt chất tối đa 150 ký tự")
    @Column(length = 150)
    private String activeIngredient;

    @Size(max = 50, message = "Dạng bào chế tối đa 50 ký tự")
    @Column(length = 50)
    private String form;

    @Size(max = 30, message = "Đơn vị tối đa 30 ký tự")
    @Column(length = 30)
    private String unit;

    @PositiveOrZero(message = "Tồn kho phải >= 0")
    private Integer stockQuantity = 0;

    @JsonIgnore
    @OneToMany(mappedBy = "medication")
    private List<PrescriptionItem> prescriptionItems = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "medication")
    private List<MedicationBatch> batches = new ArrayList<>();

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
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
