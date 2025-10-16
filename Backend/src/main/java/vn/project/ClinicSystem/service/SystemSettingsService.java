package vn.project.ClinicSystem.service;

import vn.project.ClinicSystem.model.SystemSettings;
import vn.project.ClinicSystem.model.dto.SystemSettingsDTO;
import vn.project.ClinicSystem.repository.SystemSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class SystemSettingsService {

    @Autowired
    private SystemSettingsRepository systemSettingsRepository;

    /**
     * Lấy cài đặt hệ thống
     */
    public SystemSettingsDTO getSystemSettings() {
        SystemSettings settings = systemSettingsRepository.findFirstByOrderByIdAsc();
        if (settings == null) {
            // Tạo cài đặt mặc định nếu chưa có
            settings = createDefaultSystemSettings();
        }
        return convertToDTO(settings);
    }

    /**
     * Cập nhật cài đặt hệ thống
     */
    public SystemSettingsDTO updateSystemSettings(SystemSettingsDTO settingsDTO) {
        SystemSettings existingSettings = systemSettingsRepository.findFirstByOrderByIdAsc();
        
        if (existingSettings == null) {
            // Tạo mới nếu chưa có
            existingSettings = new SystemSettings();
        }

        // Cập nhật thông tin
        updateSystemSettingsFromDTO(existingSettings, settingsDTO);
        
        SystemSettings savedSettings = systemSettingsRepository.save(existingSettings);
        return convertToDTO(savedSettings);
    }

    /**
     * Tạo cài đặt hệ thống mặc định
     */
    private SystemSettings createDefaultSystemSettings() {
        SystemSettings defaultSettings = new SystemSettings();
        defaultSettings.setClinicName("Phòng khám đa khoa");
        defaultSettings.setAddress("123 Đường ABC, Quận XYZ, TP.HCM");
        defaultSettings.setPhoneNumber("0123456789");
        defaultSettings.setEmail("info@clinic.com");
        defaultSettings.setWorkingHoursStart(java.time.LocalTime.of(8, 0));
        defaultSettings.setWorkingHoursEnd(java.time.LocalTime.of(17, 0));
        defaultSettings.setNotificationEnabled(true);
        defaultSettings.setEmailNotificationEnabled(true);
        defaultSettings.setSmsNotificationEnabled(false);
        defaultSettings.setSecuritySessionTimeout(30);
        defaultSettings.setSecurityPasswordPolicy("MEDIUM");
        defaultSettings.setSecurityTwoFactorEnabled(false);
        
        return systemSettingsRepository.save(defaultSettings);
    }

    /**
     * Chuyển đổi từ Entity sang DTO
     */
    private SystemSettingsDTO convertToDTO(SystemSettings settings) {
        return new SystemSettingsDTO(
            settings.getId(),
            settings.getClinicName(),
            settings.getAddress(),
            settings.getPhoneNumber(),
            settings.getEmail(),
            settings.getWorkingHoursStart(),
            settings.getWorkingHoursEnd(),
            settings.getNotificationEnabled(),
            settings.getEmailNotificationEnabled(),
            settings.getSmsNotificationEnabled(),
            settings.getSecuritySessionTimeout(),
            settings.getSecurityPasswordPolicy(),
            settings.getSecurityTwoFactorEnabled()
        );
    }

    /**
     * Cập nhật Entity từ DTO
     */
    private void updateSystemSettingsFromDTO(SystemSettings settings, SystemSettingsDTO dto) {
        if (dto.getClinicName() != null) {
            settings.setClinicName(dto.getClinicName());
        }
        if (dto.getAddress() != null) {
            settings.setAddress(dto.getAddress());
        }
        if (dto.getPhoneNumber() != null) {
            settings.setPhoneNumber(dto.getPhoneNumber());
        }
        if (dto.getEmail() != null) {
            settings.setEmail(dto.getEmail());
        }
        if (dto.getWorkingHoursStart() != null) {
            settings.setWorkingHoursStart(dto.getWorkingHoursStart());
        }
        if (dto.getWorkingHoursEnd() != null) {
            settings.setWorkingHoursEnd(dto.getWorkingHoursEnd());
        }
        if (dto.getNotificationEnabled() != null) {
            settings.setNotificationEnabled(dto.getNotificationEnabled());
        }
        if (dto.getEmailNotificationEnabled() != null) {
            settings.setEmailNotificationEnabled(dto.getEmailNotificationEnabled());
        }
        if (dto.getSmsNotificationEnabled() != null) {
            settings.setSmsNotificationEnabled(dto.getSmsNotificationEnabled());
        }
        if (dto.getSecuritySessionTimeout() != null) {
            settings.setSecuritySessionTimeout(dto.getSecuritySessionTimeout());
        }
        if (dto.getSecurityPasswordPolicy() != null) {
            settings.setSecurityPasswordPolicy(dto.getSecurityPasswordPolicy());
        }
        if (dto.getSecurityTwoFactorEnabled() != null) {
            settings.setSecurityTwoFactorEnabled(dto.getSecurityTwoFactorEnabled());
        }
    }
}
