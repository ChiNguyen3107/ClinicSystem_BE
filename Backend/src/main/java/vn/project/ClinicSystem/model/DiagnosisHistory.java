// package vn.project.ClinicSystem.model;

// import java.time.Instant;
// import java.util.ArrayList;
// import java.util.List;

// import com.fasterxml.jackson.annotation.JsonIgnore;

// import jakarta.persistence.Column;
// import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.Lob;
// import jakarta.persistence.ManyToOne;
// import jakarta.persistence.OneToMany;
// import jakarta.persistence.PrePersist;
// import jakarta.persistence.PreUpdate;
// import jakarta.persistence.Table;
// import lombok.Getter;
// import lombok.Setter;

// @Getter
// @Setter
// @Entity
// @Table(name = "diagnosis_history")
// public class DiagnosisHistory {
// @Id
// @GeneratedValue(strategy = GenerationType.IDENTITY)
// private Long id;

// @Lob
// private String inputPayload;

// @Lob
// private String responsePayload;

// @Column(length = 60)
// private String modelVersion;

// @JsonIgnore
// @OneToMany(mappedBy = "diagnosisHistory")
// private List<MedicalRecord> medicalRecords = new ArrayList<>();

// @ManyToOne
// @JoinColumn(name = "model_id")
// private DiagnosisModel model;

// private Instant createdAt;
// private Instant updatedAt;

// @PrePersist
// public void handleBeforeCreate() {
// this.createdAt = Instant.now();
// }

// @PreUpdate
// public void handleBeforeUpdate() {
// this.updatedAt = Instant.now();
// }
// }
