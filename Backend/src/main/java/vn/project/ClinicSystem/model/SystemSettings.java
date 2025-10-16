package vn.project.ClinicSystem.model;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "system_settings")
public class SystemSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "clinic_name", nullable = false)
    private String clinicName;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "working_hours_start")
    private LocalTime workingHoursStart;

    @Column(name = "working_hours_end")
    private LocalTime workingHoursEnd;

    @Column(name = "notification_enabled")
    private Boolean notificationEnabled = true;

    @Column(name = "email_notification_enabled")
    private Boolean emailNotificationEnabled = true;

    @Column(name = "sms_notification_enabled")
    private Boolean smsNotificationEnabled = false;

    @Column(name = "security_session_timeout")
    private Integer securitySessionTimeout = 30; // phút

    @Column(name = "security_password_policy")
    private String securityPasswordPolicy = "MEDIUM";

    @Column(name = "security_two_factor_enabled")
    private Boolean securityTwoFactorEnabled = false;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;

    // Constructors
    public SystemSettings() {
        this.createdAt = java.time.LocalDateTime.now();
        this.updatedAt = java.time.LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getClinicName() {
        return clinicName;
    }

    public void setClinicName(String clinicName) {
        this.clinicName = clinicName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalTime getWorkingHoursStart() {
        return workingHoursStart;
    }

    public void setWorkingHoursStart(LocalTime workingHoursStart) {
        this.workingHoursStart = workingHoursStart;
    }

    public LocalTime getWorkingHoursEnd() {
        return workingHoursEnd;
    }

    public void setWorkingHoursEnd(LocalTime workingHoursEnd) {
        this.workingHoursEnd = workingHoursEnd;
    }

    public Boolean getNotificationEnabled() {
        return notificationEnabled;
    }

    public void setNotificationEnabled(Boolean notificationEnabled) {
        this.notificationEnabled = notificationEnabled;
    }

    public Boolean getEmailNotificationEnabled() {
        return emailNotificationEnabled;
    }

    public void setEmailNotificationEnabled(Boolean emailNotificationEnabled) {
        this.emailNotificationEnabled = emailNotificationEnabled;
    }

    public Boolean getSmsNotificationEnabled() {
        return smsNotificationEnabled;
    }

    public void setSmsNotificationEnabled(Boolean smsNotificationEnabled) {
        this.smsNotificationEnabled = smsNotificationEnabled;
    }

    public Integer getSecuritySessionTimeout() {
        return securitySessionTimeout;
    }

    public void setSecuritySessionTimeout(Integer securitySessionTimeout) {
        this.securitySessionTimeout = securitySessionTimeout;
    }

    public String getSecurityPasswordPolicy() {
        return securityPasswordPolicy;
    }

    public void setSecurityPasswordPolicy(String securityPasswordPolicy) {
        this.securityPasswordPolicy = securityPasswordPolicy;
    }

    public Boolean getSecurityTwoFactorEnabled() {
        return securityTwoFactorEnabled;
    }

    public void setSecurityTwoFactorEnabled(Boolean securityTwoFactorEnabled) {
        this.securityTwoFactorEnabled = securityTwoFactorEnabled;
    }

    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public java.time.LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(java.time.LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = java.time.LocalDateTime.now();
    }
}
