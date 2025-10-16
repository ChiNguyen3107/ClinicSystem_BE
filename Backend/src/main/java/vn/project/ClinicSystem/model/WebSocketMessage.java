package vn.project.ClinicSystem.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebSocketMessage {
    
    private String type;
    private String title;
    private String message;
    private String userId;
    private String relatedEntityType;
    private Long relatedEntityId;
    private Map<String, Object> data;
    private LocalDateTime timestamp = LocalDateTime.now();
    
    public WebSocketMessage(String type, String title, String message) {
        this.type = type;
        this.title = title;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }
    
    public WebSocketMessage(String type, String title, String message, String userId) {
        this.type = type;
        this.title = title;
        this.message = message;
        this.userId = userId;
        this.timestamp = LocalDateTime.now();
    }
}
