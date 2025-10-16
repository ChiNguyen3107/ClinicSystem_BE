package vn.project.ClinicSystem.repository;

import vn.project.ClinicSystem.model.SystemSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SystemSettingsRepository extends JpaRepository<SystemSettings, Long> {
    // Tìm cài đặt hệ thống duy nhất (chỉ có 1 bản ghi)
    SystemSettings findFirstByOrderByIdAsc();
}
