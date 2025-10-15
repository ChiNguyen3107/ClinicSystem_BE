// package vn.project.ClinicSystem.model;

// import java.time.Instant;

// import jakarta.persistence.Column;
// import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToOne;
// import jakarta.persistence.Lob;
// import jakarta.persistence.PrePersist;
// import jakarta.persistence.PreUpdate;
// import jakarta.persistence.Table;
// import lombok.Getter;
// import lombok.Setter;

// @Getter
// @Setter
// @Entity
// @Table(name = "diagnosis_models")
// public class DiagnosisModel {
// @Id
// @GeneratedValue(strategy = GenerationType.IDENTITY)
// private Long id;

// @Column(nullable = false, length = 120)
// private String modelName;

// @Column(length = 50)
// private String version;

// @Column(length = 255)
// private String storagePath;

// private Instant trainedAt;

// @Column(length = 120)
// private String trainedBy;

// @ManyToOne
// @JoinColumn(name = "dataset_id")
// private DiagnosisDataset dataset;

// private Double accuracy;
// private Double precision;
// private Double recall;

// @Lob
// private String evaluationNotes;

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
