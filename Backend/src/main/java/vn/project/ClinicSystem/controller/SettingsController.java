package vn.project.ClinicSystem.controller;

import vn.project.ClinicSystem.model.RestResponse;
import vn.project.ClinicSystem.model.dto.SystemSettingsDTO;
import vn.project.ClinicSystem.model.dto.UserSettingsDTO;
import vn.project.ClinicSystem.service.SystemSettingsService;
import vn.project.ClinicSystem.service.UserSettingsService;
import vn.project.ClinicSystem.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SettingsController {

    @Autowired
    private SystemSettingsService systemSettingsService;

    @Autowired
    private UserSettingsService userSettingsService;

    /**
     * GET /settings/system - Lấy cài đặt hệ thống
     */
    @GetMapping("/system")
    public ResponseEntity<RestResponse<SystemSettingsDTO>> getSystemSettings() {
        try {
            SystemSettingsDTO settings = systemSettingsService.getSystemSettings();
            return ResponseUtil.success(settings, "Lấy cài đặt hệ thống thành công");
        } catch (Exception e) {
            return ResponseUtil.error("Lỗi khi lấy cài đặt hệ thống: " + e.getMessage());
        }
    }

    /**
     * PUT /settings/system - Cập nhật cài đặt hệ thống
     */
    @PutMapping("/system")
    public ResponseEntity<RestResponse<SystemSettingsDTO>> updateSystemSettings(@RequestBody SystemSettingsDTO settingsDTO) {
        try {
            SystemSettingsDTO updatedSettings = systemSettingsService.updateSystemSettings(settingsDTO);
            return ResponseUtil.success(updatedSettings, "Cập nhật cài đặt hệ thống thành công");
        } catch (Exception e) {
            return ResponseUtil.error("Lỗi khi cập nhật cài đặt hệ thống: " + e.getMessage());
        }
    }

    /**
     * GET /settings/user/{userId} - Lấy cài đặt người dùng
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<RestResponse<UserSettingsDTO>> getUserSettings(@PathVariable Long userId) {
        try {
            UserSettingsDTO settings = userSettingsService.getUserSettings(userId);
            return ResponseUtil.success(settings, "Lấy cài đặt người dùng thành công");
        } catch (Exception e) {
            return ResponseUtil.error("Lỗi khi lấy cài đặt người dùng: " + e.getMessage());
        }
    }

    /**
     * PUT /settings/user/{userId} - Cập nhật cài đặt người dùng
     */
    @PutMapping("/user/{userId}")
    public ResponseEntity<RestResponse<UserSettingsDTO>> updateUserSettings(
            @PathVariable Long userId, 
            @RequestBody UserSettingsDTO settingsDTO) {
        try {
            UserSettingsDTO updatedSettings = userSettingsService.updateUserSettings(userId, settingsDTO);
            return ResponseUtil.success(updatedSettings, "Cập nhật cài đặt người dùng thành công");
        } catch (Exception e) {
            return ResponseUtil.error("Lỗi khi cập nhật cài đặt người dùng: " + e.getMessage());
        }
    }
}
