package vn.project.ClinicSystem.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RoleRequest {
    @NotBlank
    private String name;
    private String description;

    // getters/setters
}
