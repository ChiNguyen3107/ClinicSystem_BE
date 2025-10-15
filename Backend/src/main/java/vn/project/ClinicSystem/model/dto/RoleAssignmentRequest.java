package vn.project.ClinicSystem.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RoleAssignmentRequest {
    @NotNull
    private Long userId;
    @NotBlank
    private String role;

    // getters/setters
}
