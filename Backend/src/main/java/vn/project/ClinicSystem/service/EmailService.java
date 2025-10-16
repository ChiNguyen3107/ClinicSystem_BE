package vn.project.ClinicSystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import vn.project.ClinicSystem.model.User;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;
    
    public void sendPasswordResetEmail(User user, String resetToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Đặt lại mật khẩu - Hệ thống Phòng khám");
        message.setFrom(fromEmail);
        
        String resetUrl = frontendUrl + "/reset-password?token=" + resetToken;
        String emailBody = String.format("""
            Xin chào %s,
            
            Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.
            
            Để đặt lại mật khẩu, vui lòng nhấp vào liên kết sau:
            %s
            
            Liên kết này sẽ hết hạn sau 15 phút.
            
            Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
            
            Trân trọng,
            Đội ngũ Hệ thống Phòng khám
            """, user.getFullName(), resetUrl);
        
        message.setText(emailBody);
        mailSender.send(message);
    }
    
    public void sendWelcomeEmail(User user) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Chào mừng đến với Hệ thống Phòng khám");
        message.setFrom(fromEmail);
        
        String emailBody = String.format("""
            Xin chào %s,
            
            Chào mừng bạn đến với Hệ thống Phòng khám!
            
            Tài khoản của bạn đã được tạo thành công với email: %s
            
            Bạn có thể đăng nhập vào hệ thống tại: %s
            
            Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.
            
            Trân trọng,
            Đội ngũ Hệ thống Phòng khám
            """, user.getFullName(), user.getEmail(), frontendUrl);
        
        message.setText(emailBody);
        mailSender.send(message);
    }
    
    public void sendSecurityAlertEmail(User user, String action, String details) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Cảnh báo bảo mật - Hệ thống Phòng khám");
        message.setFrom(fromEmail);
        
        String emailBody = String.format("""
            Xin chào %s,
            
            Chúng tôi phát hiện hoạt động bất thường trên tài khoản của bạn:
            
            Hành động: %s
            Chi tiết: %s
            Thời gian: %s
            
            Nếu đây không phải là hoạt động của bạn, vui lòng:
            1. Thay đổi mật khẩu ngay lập tức
            2. Liên hệ với chúng tôi để được hỗ trợ
            
            Trân trọng,
            Đội ngũ Bảo mật Hệ thống Phòng khám
            """, user.getFullName(), action, details, java.time.Instant.now());
        
        message.setText(emailBody);
        mailSender.send(message);
    }
}
