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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

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
@Tag(name = "Authentication", description = "API quản lý xác thực và phân quyền")
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

    @Operation(
        summary = "Đăng nhập hệ thống",
        description = "Xác thực người dùng và trả về access token và refresh token"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Đăng nhập thành công",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ResLoginDTO.class),
                examples = @ExampleObject(
                    name = "Success Response",
                    value = """
                    {
                        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    }
                    """
                )
            )
        ),
        @ApiResponse(
            responseCode = "401", 
            description = "Thông tin đăng nhập không chính xác",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Unauthorized",
                    value = """
                    {
                        "error": "Unauthorized",
                        "message": "Invalid credentials"
                    }
                    """
                )
            )
        ),
        @ApiResponse(
            responseCode = "429", 
            description = "Quá nhiều lần thử đăng nhập",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Too Many Requests",
                    value = """
                    {
                        "error": "Too Many Requests",
                        "message": "Rate limit exceeded"
                    }
                    """
                )
            )
        )
    })
    @PostMapping("/login")
    public ResponseEntity<ResLoginDTO> login(
        @Parameter(description = "Thông tin đăng nhập", required = true)
        @Valid @RequestBody LoginDTO loginDTO, 
        HttpServletRequest request) {
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

    @Operation(
        summary = "Đăng xuất hệ thống",
        description = "Đăng xuất người dùng và thu hồi token"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Đăng xuất thành công",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Success Response",
                    value = """
                    {
                        "message": "Đăng xuất thành công"
                    }
                    """
                )
            )
        ),
        @ApiResponse(
            responseCode = "401", 
            description = "Chưa đăng nhập",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Unauthorized",
                    value = """
                    {
                        "error": "Unauthorized",
                        "message": "Authentication required"
                    }
                    """
                )
            )
        )
    })
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
    
    @Operation(
        summary = "Làm mới token",
        description = "Sử dụng refresh token để lấy access token mới"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Token được làm mới thành công",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ResLoginDTO.class),
                examples = @ExampleObject(
                    name = "Success Response",
                    value = """
                    {
                        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    }
                    """
                )
            )
        ),
        @ApiResponse(
            responseCode = "401", 
            description = "Refresh token không hợp lệ hoặc đã hết hạn",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Unauthorized",
                    value = """
                    {
                        "error": "Unauthorized",
                        "message": "Invalid refresh token"
                    }
                    """
                )
            )
        )
    })
    @PostMapping("/refresh")
    public ResponseEntity<ResLoginDTO> refreshToken(
        @Parameter(description = "Refresh token để làm mới access token", required = true)
        @Valid @RequestBody RefreshTokenDTO refreshTokenDTO) {
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
    
    @Operation(
        summary = "Quên mật khẩu",
        description = "Gửi email đặt lại mật khẩu cho người dùng"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Email đặt lại mật khẩu đã được gửi",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Success Response",
                    value = """
                    {
                        "message": "Email đặt lại mật khẩu đã được gửi"
                    }
                    """
                )
            )
        ),
        @ApiResponse(
            responseCode = "400", 
            description = "Email không tồn tại hoặc lỗi xử lý",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Bad Request",
                    value = """
                    {
                        "error": "Email không tồn tại"
                    }
                    """
                )
            )
        )
    })
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
        @Parameter(description = "Email để đặt lại mật khẩu", required = true)
        @Valid @RequestBody ForgotPasswordDTO forgotPasswordDTO) {
        try {
            User user = userRepository.findByEmail(forgotPasswordDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));
            
            passwordResetService.createPasswordResetToken(user);
            
            return ResponseEntity.ok(Map.of("message", "Email đặt lại mật khẩu đã được gửi"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @Operation(
        summary = "Đặt lại mật khẩu",
        description = "Đặt lại mật khẩu mới bằng token từ email"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Mật khẩu đã được đặt lại thành công",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Success Response",
                    value = """
                    {
                        "message": "Mật khẩu đã được đặt lại thành công"
                    }
                    """
                )
            )
        ),
        @ApiResponse(
            responseCode = "400", 
            description = "Token không hợp lệ hoặc đã hết hạn",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Bad Request",
                    value = """
                    {
                        "error": "Token không hợp lệ hoặc đã hết hạn"
                    }
                    """
                )
            )
        )
    })
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
        @Parameter(description = "Token và mật khẩu mới", required = true)
        @Valid @RequestBody ResetPasswordDTO resetPasswordDTO) {
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
