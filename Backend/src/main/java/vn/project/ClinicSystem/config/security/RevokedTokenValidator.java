package vn.project.ClinicSystem.config.security;

import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

import vn.project.ClinicSystem.service.RevokedTokenService;

public class RevokedTokenValidator implements OAuth2TokenValidator<Jwt> {

    private static final OAuth2Error TOKEN_REVOKED_ERROR = new OAuth2Error("invalid_token",
            "Token has been revoked", null);

    private final RevokedTokenService revokedTokenService;

    public RevokedTokenValidator(RevokedTokenService revokedTokenService) {
        this.revokedTokenService = revokedTokenService;
    }

    @Override
    public OAuth2TokenValidatorResult validate(Jwt token) {
        String tokenValue = token.getTokenValue();
        if (revokedTokenService.isRevoked(tokenValue)) {
            return OAuth2TokenValidatorResult.failure(TOKEN_REVOKED_ERROR);
        }
        return OAuth2TokenValidatorResult.success();
    }
}
