package vn.project.ClinicSystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.project.ClinicSystem.repository.NotificationRepository;
import vn.project.ClinicSystem.model.dto.NotificationDTO;
import vn.project.ClinicSystem.model.Notification;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    public Notification createNotification(String title, String message, 
                                        Notification.NotificationType type, 
                                        Long userId, 
                                        String relatedEntityType, 
                                        Long relatedEntityId) {
        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setUserId(userId);
        notification.setRelatedEntityType(relatedEntityType);
        notification.setRelatedEntityId(relatedEntityId);
        notification.setCreatedAt(LocalDateTime.now());
        
        return notificationRepository.save(notification);
    }
    
    public List<NotificationDTO> getNotificationsByUserId(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return notifications.stream()
                .map(NotificationDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<NotificationDTO> getUnreadNotificationsByUserId(Long userId) {
        List<Notification> notifications = notificationRepository
                .findByUserIdAndStatusOrderByCreatedAtDesc(userId, Notification.NotificationStatus.UNREAD);
        return notifications.stream()
                .map(NotificationDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElse(null);
        if (notification != null) {
            notification.setStatus(Notification.NotificationStatus.READ);
            notification.setReadAt(LocalDateTime.now());
            notificationRepository.save(notification);
        }
    }
    
    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = notificationRepository
                .findByUserIdAndStatusOrderByCreatedAtDesc(userId, Notification.NotificationStatus.UNREAD);
        for (Notification notification : unreadNotifications) {
            notification.setStatus(Notification.NotificationStatus.READ);
            notification.setReadAt(LocalDateTime.now());
        }
        notificationRepository.saveAll(unreadNotifications);
    }
    
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndStatus(userId, Notification.NotificationStatus.UNREAD);
    }
    
    // Helper methods for creating specific notification types
    public Notification createAppointmentNotification(String action, Long appointmentId, Long userId) {
        String title = "Cuộc hẹn " + action;
        String message = "Cuộc hẹn đã được " + action.toLowerCase();
        Notification.NotificationType type = getAppointmentNotificationType(action);
        
        return createNotification(title, message, type, userId, "APPOINTMENT", appointmentId);
    }
    
    public Notification createPatientCheckInNotification(Long patientId, Long userId) {
        String title = "Bệnh nhân đã check-in";
        String message = "Bệnh nhân đã đến và check-in";
        
        return createNotification(title, message, Notification.NotificationType.PATIENT_CHECKED_IN, 
                                userId, "PATIENT", patientId);
    }
    
    public Notification createBillingStatusNotification(String status, Long billingId, Long userId) {
        String title = "Trạng thái hóa đơn thay đổi";
        String message = "Hóa đơn đã được cập nhật trạng thái: " + status;
        
        return createNotification(title, message, Notification.NotificationType.BILLING_STATUS_CHANGED, 
                                userId, "BILLING", billingId);
    }
    
    private Notification.NotificationType getAppointmentNotificationType(String action) {
        switch (action.toLowerCase()) {
            case "tạo":
            case "created":
                return Notification.NotificationType.APPOINTMENT_CREATED;
            case "cập nhật":
            case "updated":
                return Notification.NotificationType.APPOINTMENT_UPDATED;
            case "hủy":
            case "cancelled":
                return Notification.NotificationType.APPOINTMENT_CANCELLED;
            default:
                return Notification.NotificationType.SYSTEM_NOTIFICATION;
        }
    }
}
