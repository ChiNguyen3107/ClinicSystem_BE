package vn.project.ClinicSystem.model.dto;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ServiceOrderResultRequest {

    private Long performedById;

    private LocalDateTime performedAt;

    @Size(max = 1000, message = "Kết luận tối đa 1000 ký tự")
    private String overallConclusion;

    @NotEmpty(message = "Cần nhập ít nhất một chỉ số kết quả")
    private List<@Valid ServiceOrderResultEntryRequest> indicators;
}
