package vn.project.ClinicSystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import vn.project.ClinicSystem.model.Notification;
import vn.project.ClinicSystem.model.WebSocketMessage;

@Service
public class RealTimeEventService {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private NotificationService notificationService;
    
    // Appointment Events
    public void notifyAppointmentCreated(Long appointmentId, Long doctorId, Long patientId) {
        // Tạo notification cho bác sĩ
        Notification doctorNotification = notificationService.createAppointmentNotification(
            "tạo", appointmentId, doctorId);
        
        // Tạo notification cho bệnh nhân
        Notification patientNotification = notificationService.createAppointmentNotification(
            "tạo", appointmentId, patientId);
        
        // Gửi WebSocket message
        WebSocketMessage doctorMessage = new WebSocketMessage(
            "APPOINTMENT_CREATED", 
            "Cuộc hẹn mới", 
            "Bạn có cuộc hẹn mới được tạo",
            doctorId.toString()
        );
        doctorMessage.setRelatedEntityType("APPOINTMENT");
        doctorMessage.setRelatedEntityId(appointmentId);
        
        WebSocketMessage patientMessage = new WebSocketMessage(
            "APPOINTMENT_CREATED", 
            "Cuộc hẹn mới", 
            "Cuộc hẹn của bạn đã được tạo",
            patientId.toString()
        );
        patientMessage.setRelatedEntityType("APPOINTMENT");
        patientMessage.setRelatedEntityId(appointmentId);
        
        sendNotificationToUser(doctorId, doctorMessage);
        sendNotificationToUser(patientId, patientMessage);
    }
    
    public void notifyAppointmentUpdated(Long appointmentId, Long doctorId, Long patientId) {
        Notification doctorNotification = notificationService.createAppointmentNotification(
            "cập nhật", appointmentId, doctorId);
        
        Notification patientNotification = notificationService.createAppointmentNotification(
            "cập nhật", appointmentId, patientId);
        
        WebSocketMessage doctorMessage = new WebSocketMessage(
            "APPOINTMENT_UPDATED", 
            "Cuộc hẹn đã cập nhật", 
            "Cuộc hẹn đã được cập nhật",
            doctorId.toString()
        );
        doctorMessage.setRelatedEntityType("APPOINTMENT");
        doctorMessage.setRelatedEntityId(appointmentId);
        
        WebSocketMessage patientMessage = new WebSocketMessage(
            "APPOINTMENT_UPDATED", 
            "Cuộc hẹn đã cập nhật", 
            "Cuộc hẹn của bạn đã được cập nhật",
            patientId.toString()
        );
        patientMessage.setRelatedEntityType("APPOINTMENT");
        patientMessage.setRelatedEntityId(appointmentId);
        
        sendNotificationToUser(doctorId, doctorMessage);
        sendNotificationToUser(patientId, patientMessage);
    }
    
    public void notifyAppointmentCancelled(Long appointmentId, Long doctorId, Long patientId) {
        Notification doctorNotification = notificationService.createAppointmentNotification(
            "hủy", appointmentId, doctorId);
        
        Notification patientNotification = notificationService.createAppointmentNotification(
            "hủy", appointmentId, patientId);
        
        WebSocketMessage doctorMessage = new WebSocketMessage(
            "APPOINTMENT_CANCELLED", 
            "Cuộc hẹn đã hủy", 
            "Cuộc hẹn đã được hủy",
            doctorId.toString()
        );
        doctorMessage.setRelatedEntityType("APPOINTMENT");
        doctorMessage.setRelatedEntityId(appointmentId);
        
        WebSocketMessage patientMessage = new WebSocketMessage(
            "APPOINTMENT_CANCELLED", 
            "Cuộc hẹn đã hủy", 
            "Cuộc hẹn của bạn đã được hủy",
            patientId.toString()
        );
        patientMessage.setRelatedEntityType("APPOINTMENT");
        patientMessage.setRelatedEntityId(appointmentId);
        
        sendNotificationToUser(doctorId, doctorMessage);
        sendNotificationToUser(patientId, patientMessage);
    }
    
    // Patient Events
    public void notifyPatientCheckedIn(Long patientId, Long doctorId) {
        Notification notification = notificationService.createPatientCheckInNotification(patientId, doctorId);
        
        WebSocketMessage message = new WebSocketMessage(
            "PATIENT_CHECKED_IN", 
            "Bệnh nhân đã check-in", 
            "Bệnh nhân đã đến và check-in",
            doctorId.toString()
        );
        message.setRelatedEntityType("PATIENT");
        message.setRelatedEntityId(patientId);
        
        sendNotificationToUser(doctorId, message);
    }
    
    // Billing Events
    public void notifyBillingStatusChanged(Long billingId, String status, Long userId) {
        Notification notification = notificationService.createBillingStatusNotification(status, billingId, userId);
        
        WebSocketMessage message = new WebSocketMessage(
            "BILLING_STATUS_CHANGED", 
            "Trạng thái hóa đơn thay đổi", 
            "Hóa đơn đã được cập nhật trạng thái: " + status,
            userId.toString()
        );
        message.setRelatedEntityType("BILLING");
        message.setRelatedEntityId(billingId);
        
        sendNotificationToUser(userId, message);
    }
    
    // System Notifications
    public void notifySystemMessage(String title, String message, Long userId) {
        Notification notification = notificationService.createNotification(
            title, message, Notification.NotificationType.SYSTEM_NOTIFICATION, 
            userId, "SYSTEM", null);
        
        WebSocketMessage wsMessage = new WebSocketMessage(
            "SYSTEM_NOTIFICATION", 
            title, 
            message,
            userId.toString()
        );
        wsMessage.setRelatedEntityType("SYSTEM");
        
        sendNotificationToUser(userId, wsMessage);
    }
    
    public void broadcastSystemMessage(String title, String message) {
        WebSocketMessage wsMessage = new WebSocketMessage(
            "SYSTEM_NOTIFICATION", 
            title, 
            message
        );
        wsMessage.setRelatedEntityType("SYSTEM");
        
        messagingTemplate.convertAndSend("/topic/notifications", wsMessage);
    }
    
    // Helper methods
    private void sendNotificationToUser(Long userId, WebSocketMessage message) {
        messagingTemplate.convertAndSendToUser(
            userId.toString(), 
            "/queue/notifications", 
            message
        );
    }
}
