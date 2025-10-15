package vn.project.ClinicSystem.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import vn.project.ClinicSystem.model.RevokedToken;
import vn.project.ClinicSystem.repository.RevokedTokenRepository;

@ExtendWith(MockitoExtension.class)
class RevokedTokenServiceTest {

    @Mock
    private RevokedTokenRepository revokedTokenRepository;

    @InjectMocks
    private RevokedTokenService revokedTokenService;

    private Instant expiresAt;

    @BeforeEach
    void setUp() {
        expiresAt = Instant.now().plusSeconds(3600);
    }

    @Test
    void revoke_shouldPersistToken_whenNotExists() {
        when(revokedTokenRepository.existsByToken("tokenValue")).thenReturn(false);
        when(revokedTokenRepository.save(any(RevokedToken.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        revokedTokenService.revoke("tokenValue", expiresAt);

        verify(revokedTokenRepository).save(any(RevokedToken.class));
    }

    @Test
    void revoke_shouldSkip_whenTokenAlreadyRevoked() {
        when(revokedTokenRepository.existsByToken("tokenValue")).thenReturn(true);

        revokedTokenService.revoke("tokenValue", expiresAt);

        verify(revokedTokenRepository, times(0)).save(any(RevokedToken.class));
    }

    @Test
    void isRevoked_shouldDelegateToRepository() {
        when(revokedTokenRepository.existsByToken("abc")).thenReturn(true);

        boolean result = revokedTokenService.isRevoked("abc");

        assertThat(result).isTrue();
        verify(revokedTokenRepository).existsByToken("abc");
    }

    @Test
    void purgeExpired_shouldRemovePastTokens() {
        revokedTokenService.purgeExpired();
        verify(revokedTokenRepository).deleteByExpiresAtBefore(any(Instant.class));
    }
}
