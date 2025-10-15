package vn.project.ClinicSystem.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MedicalServiceUpdateRequest {

    private String code;
    private String name;
    private String description;

    private Long basePrice;

    private Long clinicRoomId;
}
