package vn.project.ClinicSystem.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RefreshTokenDTO {
    
    @NotBlank(message = "Refresh token không được để trống")
    private String refreshToken;
}
