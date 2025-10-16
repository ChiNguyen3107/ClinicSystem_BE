package vn.project.ClinicSystem.service;

import vn.project.ClinicSystem.model.UserSettings;
import vn.project.ClinicSystem.model.dto.UserSettingsDTO;
import vn.project.ClinicSystem.repository.UserSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class UserSettingsService {

    @Autowired
    private UserSettingsRepository userSettingsRepository;

    /**
     * Lấy cài đặt người dùng theo userId
     */
    public UserSettingsDTO getUserSettings(Long userId) {
        Optional<UserSettings> settingsOpt = userSettingsRepository.findByUserId(userId);
        
        if (settingsOpt.isPresent()) {
            return convertToDTO(settingsOpt.get());
        } else {
            // Tạo cài đặt mặc định cho người dùng
            UserSettings defaultSettings = createDefaultUserSettings(userId);
            return convertToDTO(defaultSettings);
        }
    }

    /**
     * Cập nhật cài đặt người dùng
     */
    public UserSettingsDTO updateUserSettings(Long userId, UserSettingsDTO settingsDTO) {
        Optional<UserSettings> existingSettingsOpt = userSettingsRepository.findByUserId(userId);
        
        UserSettings settings;
        if (existingSettingsOpt.isPresent()) {
            settings = existingSettingsOpt.get();
        } else {
            settings = new UserSettings(userId);
        }

        // Cập nhật thông tin
        updateUserSettingsFromDTO(settings, settingsDTO);
        
        UserSettings savedSettings = userSettingsRepository.save(settings);
        return convertToDTO(savedSettings);
    }

    /**
     * Tạo cài đặt người dùng mặc định
     */
    private UserSettings createDefaultUserSettings(Long userId) {
        UserSettings defaultSettings = new UserSettings(userId);
        defaultSettings.setLanguage("vi");
        defaultSettings.setTimezone("Asia/Ho_Chi_Minh");
        defaultSettings.setDateFormat("dd/MM/yyyy");
        defaultSettings.setTimeFormat("24h");
        defaultSettings.setTheme("light");
        defaultSettings.setNotificationEnabled(true);
        defaultSettings.setEmailNotificationEnabled(true);
        defaultSettings.setSmsNotificationEnabled(false);
        defaultSettings.setAppointmentReminder(true);
        defaultSettings.setAppointmentReminderTime(30);
        defaultSettings.setPrescriptionReminder(true);
        defaultSettings.setBillingNotification(true);
        defaultSettings.setDashboardLayout("default");
        defaultSettings.setItemsPerPage(10);
        defaultSettings.setAutoRefresh(true);
        defaultSettings.setAutoRefreshInterval(30);
        
        return userSettingsRepository.save(defaultSettings);
    }

    /**
     * Chuyển đổi từ Entity sang DTO
     */
    private UserSettingsDTO convertToDTO(UserSettings settings) {
        return new UserSettingsDTO(
            settings.getId(),
            settings.getUserId(),
            settings.getLanguage(),
            settings.getTimezone(),
            settings.getDateFormat(),
            settings.getTimeFormat(),
            settings.getTheme(),
            settings.getNotificationEnabled(),
            settings.getEmailNotificationEnabled(),
            settings.getSmsNotificationEnabled(),
            settings.getAppointmentReminder(),
            settings.getAppointmentReminderTime(),
            settings.getPrescriptionReminder(),
            settings.getBillingNotification(),
            settings.getDashboardLayout(),
            settings.getItemsPerPage(),
            settings.getAutoRefresh(),
            settings.getAutoRefreshInterval()
        );
    }

    /**
     * Cập nhật Entity từ DTO
     */
    private void updateUserSettingsFromDTO(UserSettings settings, UserSettingsDTO dto) {
        if (dto.getLanguage() != null) {
            settings.setLanguage(dto.getLanguage());
        }
        if (dto.getTimezone() != null) {
            settings.setTimezone(dto.getTimezone());
        }
        if (dto.getDateFormat() != null) {
            settings.setDateFormat(dto.getDateFormat());
        }
        if (dto.getTimeFormat() != null) {
            settings.setTimeFormat(dto.getTimeFormat());
        }
        if (dto.getTheme() != null) {
            settings.setTheme(dto.getTheme());
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
        if (dto.getAppointmentReminder() != null) {
            settings.setAppointmentReminder(dto.getAppointmentReminder());
        }
        if (dto.getAppointmentReminderTime() != null) {
            settings.setAppointmentReminderTime(dto.getAppointmentReminderTime());
        }
        if (dto.getPrescriptionReminder() != null) {
            settings.setPrescriptionReminder(dto.getPrescriptionReminder());
        }
        if (dto.getBillingNotification() != null) {
            settings.setBillingNotification(dto.getBillingNotification());
        }
        if (dto.getDashboardLayout() != null) {
            settings.setDashboardLayout(dto.getDashboardLayout());
        }
        if (dto.getItemsPerPage() != null) {
            settings.setItemsPerPage(dto.getItemsPerPage());
        }
        if (dto.getAutoRefresh() != null) {
            settings.setAutoRefresh(dto.getAutoRefresh());
        }
        if (dto.getAutoRefreshInterval() != null) {
            settings.setAutoRefreshInterval(dto.getAutoRefreshInterval());
        }
    }
}
