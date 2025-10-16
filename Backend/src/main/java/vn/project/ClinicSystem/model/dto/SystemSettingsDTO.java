package vn.project.ClinicSystem.model.dto;

import java.time.LocalTime;

public class SystemSettingsDTO {
    private Long id;
    private String clinicName;
    private String address;
    private String phoneNumber;
    private String email;
    private LocalTime workingHoursStart;
    private LocalTime workingHoursEnd;
    private Boolean notificationEnabled;
    private Boolean emailNotificationEnabled;
    private Boolean smsNotificationEnabled;
    private Integer securitySessionTimeout;
    private String securityPasswordPolicy;
    private Boolean securityTwoFactorEnabled;

    // Constructors
    public SystemSettingsDTO() {}

    public SystemSettingsDTO(Long id, String clinicName, String address, String phoneNumber, String email,
                            LocalTime workingHoursStart, LocalTime workingHoursEnd, Boolean notificationEnabled,
                            Boolean emailNotificationEnabled, Boolean smsNotificationEnabled,
                            Integer securitySessionTimeout, String securityPasswordPolicy,
                            Boolean securityTwoFactorEnabled) {
        this.id = id;
        this.clinicName = clinicName;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.workingHoursStart = workingHoursStart;
        this.workingHoursEnd = workingHoursEnd;
        this.notificationEnabled = notificationEnabled;
        this.emailNotificationEnabled = emailNotificationEnabled;
        this.smsNotificationEnabled = smsNotificationEnabled;
        this.securitySessionTimeout = securitySessionTimeout;
        this.securityPasswordPolicy = securityPasswordPolicy;
        this.securityTwoFactorEnabled = securityTwoFactorEnabled;
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
}
