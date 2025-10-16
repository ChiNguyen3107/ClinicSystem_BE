package vn.project.ClinicSystem.service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import vn.project.ClinicSystem.model.PasswordResetToken;
import vn.project.ClinicSystem.model.User;
import vn.project.ClinicSystem.repository.PasswordResetTokenRepository;
import vn.project.ClinicSystem.repository.UserRepository;

@Service
public class PasswordResetService {
    
    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private EmailService emailService;
    
    @Value("${clinicsystem.password-reset.token-validity-in-seconds:900}") // 15 minutes
    private long passwordResetTokenValidityInSeconds;
    
    public PasswordResetToken createPasswordResetToken(User user) {
        // Delete existing tokens for this user
        passwordResetTokenRepository.deleteByUser(user);
        
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUser(user);
        resetToken.setToken(UUID.randomUUID().toString());
        resetToken.setExpiryDate(Instant.now().plusSeconds(passwordResetTokenValidityInSeconds));
        resetToken.setIsUsed(false);
        
        PasswordResetToken savedToken = passwordResetTokenRepository.save(resetToken);
        
        // Send email
        emailService.sendPasswordResetEmail(user, savedToken.getToken());
        
        return savedToken;
    }
    
    public Optional<PasswordResetToken> findByToken(String token) {
        return passwordResetTokenRepository.findByToken(token);
    }
    
    public boolean isTokenValid(PasswordResetToken token) {
        if (token.getIsUsed()) {
            return false;
        }
        
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            return false;
        }
        
        return true;
    }
    
    public void resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository.findByToken(token);
        
        if (tokenOpt.isEmpty()) {
            throw new RuntimeException("Token không hợp lệ");
        }
        
        PasswordResetToken resetToken = tokenOpt.get();
        
        if (!isTokenValid(resetToken)) {
            throw new RuntimeException("Token đã hết hạn hoặc đã được sử dụng");
        }
        
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        // Mark token as used
        resetToken.setIsUsed(true);
        passwordResetTokenRepository.save(resetToken);
        
        // Revoke all refresh tokens for security
        // This would be implemented if you have a refresh token service
    }
    
    public void deleteExpiredTokens() {
        passwordResetTokenRepository.deleteExpiredTokens(Instant.now());
    }
}
