package vn.project.ClinicSystem.controller;

import java.time.Instant;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import vn.project.ClinicSystem.model.User;
import vn.project.ClinicSystem.model.dto.ForgotPasswordDTO;
import vn.project.ClinicSystem.model.dto.LoginDTO;
import vn.project.ClinicSystem.model.dto.RefreshTokenDTO;
import vn.project.ClinicSystem.model.dto.ResLoginDTO;
import vn.project.ClinicSystem.model.dto.ResetPasswordDTO;
import vn.project.ClinicSystem.repository.UserRepository;
import vn.project.ClinicSystem.service.AuditService;
import vn.project.ClinicSystem.service.PasswordResetService;
import vn.project.ClinicSystem.service.RateLimitService;
import vn.project.ClinicSystem.service.RefreshTokenService;
import vn.project.ClinicSystem.service.RevokedTokenService;
import vn.project.ClinicSystem.util.SecurityUtil;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final SecurityUtil securityUtil;
    private final RevokedTokenService revokedTokenService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RefreshTokenService refreshTokenService;
    
    @Autowired
    private PasswordResetService passwordResetService;
    
    @Autowired
    private RateLimitService rateLimitService;
    
    @Autowired
    private AuditService auditService;

    public AuthController(AuthenticationManager authenticationManager,
            SecurityUtil securityUtil,
            RevokedTokenService revokedTokenService) {
        this.authenticationManager = authenticationManager;
        this.securityUtil = securityUtil;
        this.revokedTokenService = revokedTokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody LoginDTO loginDTO, HttpServletRequest request) {
        String clientIp = getClientIpAddress(request);
        
        // Check rate limiting
        if (!rateLimitService.isLoginAllowed(loginDTO.getUsername(), clientIp)) {
            auditService.logSecurityEvent(null, "LOGIN_BLOCKED", 
                "Email: " + loginDTO.getUsername() + ", IP: " + clientIp, request);
            return ResponseEntity.status(429).body(null);
        }
        
        try {
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    loginDTO.getUsername(), loginDTO.getPassword());
            Authentication authentication = authenticationManager.authenticate(authenticationToken);

            String accessToken = this.securityUtil.createToken(authentication);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Get user and create refresh token
            User user = userRepository.findByEmail(loginDTO.getUsername()).orElse(null);
            String refreshToken = null;
            if (user != null) {
                refreshToken = refreshTokenService.createRefreshToken(user).getToken();
                auditService.logAction(user, "LOGIN", "AUTH", user.getId().toString(), null, null, request);
            }

            ResLoginDTO res = new ResLoginDTO();
            res.setAccessToken(accessToken);
            res.setRefreshToken(refreshToken);

            // Record successful login
            rateLimitService.recordLoginAttempt(loginDTO.getUsername(), clientIp, true);
            auditService.logLoginAttempt(loginDTO.getUsername(), true, "Login successful", request);

            return ResponseEntity.ok().body(res);
        } catch (Exception e) {
            // Record failed login
            rateLimitService.recordLoginAttempt(loginDTO.getUsername(), clientIp, false);
            auditService.logLoginAttempt(loginDTO.getUsername(), false, "Login failed: " + e.getMessage(), request);
            throw e;
        }
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        // Log logout action
        if (authentication instanceof JwtAuthenticationToken jwtAuthenticationToken) {
            Jwt jwt = jwtAuthenticationToken.getToken();
            Instant expiresAt = jwt.getExpiresAt();
            revokedTokenService.revoke(jwt.getTokenValue(), expiresAt != null ? expiresAt : Instant.now());
            
            // Get user and log action
            String email = jwt.getClaimAsString("sub");
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                auditService.logAction(user, "LOGOUT", "AUTH", user.getId().toString(), null, null, request);
                refreshTokenService.revokeAllUserTokens(user);
            }
        }
        
        SecurityContextHolder.clearContext();
        revokedTokenService.purgeExpired();
        return ResponseEntity.ok(Map.of("message", "Đăng xuất thành công"));
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<ResLoginDTO> refreshToken(@Valid @RequestBody RefreshTokenDTO refreshTokenDTO) {
        try {
            var refreshToken = refreshTokenService.findByToken(refreshTokenDTO.getRefreshToken())
                .orElseThrow(() -> new RuntimeException("Refresh token không hợp lệ"));
            
            refreshToken = refreshTokenService.verifyExpiration(refreshToken);
            
            User user = refreshToken.getUser();
            String newAccessToken = securityUtil.createToken(
                new UsernamePasswordAuthenticationToken(user.getEmail(), null, user.getAuthorities())
            );
            
            ResLoginDTO res = new ResLoginDTO();
            res.setAccessToken(newAccessToken);
            res.setRefreshToken(refreshToken.getToken());
            
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(null);
        }
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordDTO forgotPasswordDTO) {
        try {
            User user = userRepository.findByEmail(forgotPasswordDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));
            
            passwordResetService.createPasswordResetToken(user);
            
            return ResponseEntity.ok(Map.of("message", "Email đặt lại mật khẩu đã được gửi"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordDTO resetPasswordDTO) {
        try {
            passwordResetService.resetPassword(resetPasswordDTO.getToken(), resetPasswordDTO.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Mật khẩu đã được đặt lại thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}
