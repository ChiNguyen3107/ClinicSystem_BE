package vn.project.ClinicSystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import vn.project.ClinicSystem.model.WebSocketMessage;
import vn.project.ClinicSystem.service.NotificationService;

import java.util.List;

@Controller
public class WebSocketController {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private NotificationService notificationService;
    
    @MessageMapping("/broadcast")
    @SendTo("/topic/notifications")
    public WebSocketMessage broadcast(WebSocketMessage message) {
        return message;
    }
    
    @PostMapping("/ws/broadcast")
    public void sendBroadcast(@RequestBody WebSocketMessage message) {
        messagingTemplate.convertAndSend("/topic/notifications", message);
    }
    
    @GetMapping("/ws/notifications/{userId}")
    @ResponseBody
    public List<Object> getNotifications(@PathVariable Long userId) {
        return notificationService.getNotificationsByUserId(userId);
    }
    
    public void sendNotificationToUser(Long userId, WebSocketMessage message) {
        messagingTemplate.convertAndSendToUser(
            userId.toString(), 
            "/queue/notifications", 
            message
        );
    }
    
    public void sendBroadcastNotification(WebSocketMessage message) {
        messagingTemplate.convertAndSend("/topic/notifications", message);
    }
}
