package vn.project.ClinicSystem.service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import vn.project.ClinicSystem.model.RefreshToken;
import vn.project.ClinicSystem.model.User;
import vn.project.ClinicSystem.repository.RefreshTokenRepository;

@Service
public class RefreshTokenService {
    
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;
    
    @Value("${clinicsystem.jwt.refresh-token-validity-in-seconds:604800}") // 7 days
    private long refreshTokenValidityInSeconds;
    
    public RefreshToken createRefreshToken(User user) {
        // Revoke existing refresh tokens for this user
        refreshTokenRepository.revokeByUser(user);
        
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusSeconds(refreshTokenValidityInSeconds));
        refreshToken.setIsRevoked(false);
        
        return refreshTokenRepository.save(refreshToken);
    }
    
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }
    
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token đã hết hạn. Vui lòng đăng nhập lại.");
        }
        
        if (token.getIsRevoked()) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token đã bị thu hồi. Vui lòng đăng nhập lại.");
        }
        
        return token;
    }
    
    public void revokeToken(String token) {
        Optional<RefreshToken> refreshToken = refreshTokenRepository.findByToken(token);
        if (refreshToken.isPresent()) {
            refreshToken.get().setIsRevoked(true);
            refreshTokenRepository.save(refreshToken.get());
        }
    }
    
    public void revokeAllUserTokens(User user) {
        refreshTokenRepository.revokeByUser(user);
    }
    
    public void deleteExpiredTokens() {
        refreshTokenRepository.deleteExpiredTokens(Instant.now());
    }
}
