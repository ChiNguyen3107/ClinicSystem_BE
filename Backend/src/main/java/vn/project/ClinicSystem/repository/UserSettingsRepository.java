package vn.project.ClinicSystem.repository;

import vn.project.ClinicSystem.model.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {
    // Tìm cài đặt người dùng theo userId
    Optional<UserSettings> findByUserId(Long userId);
    
    // Kiểm tra xem người dùng đã có cài đặt chưa
    boolean existsByUserId(Long userId);
}
