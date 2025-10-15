package vn.project.ClinicSystem.model;

import java.math.BigDecimal;
import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
import jakarta.persistence.Table;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import vn.project.ClinicSystem.model.enums.IndicatorResultLevel;

@Getter
@Setter
@Entity
@Table(name = "service_order_results")
public class ServiceOrderResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "service_order_id", nullable = false)
    private ServiceOrder serviceOrder;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "indicator_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private ServiceIndicator indicator;

    @Size(max = 150, message = "Tên chỉ số tối đa 150 ký tự")
    @Column(length = 150)
    private String indicatorNameSnapshot;

    @Size(max = 30, message = "Đơn vị tối đa 30 ký tự")
    @Column(length = 30)
    private String unitSnapshot;

    @NotNull(message = "Giá trị đo không được để trống")
    @Digits(integer = 12, fraction = 4, message = "Giá trị đo không hợp lệ")
    @Column(nullable = false, precision = 12, scale = 4)
    private BigDecimal measuredValue;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private IndicatorResultLevel evaluation = IndicatorResultLevel.UNKNOWN;

    @Size(max = 500, message = "Ghi chú tối đa 500 ký tự")
    @Column(length = 500)
    private String note;

    @Column(nullable = false)
    private Instant recordedAt;

    @PrePersist
    public void handleBeforeCreate() {
        this.recordedAt = Instant.now();
    }
}
