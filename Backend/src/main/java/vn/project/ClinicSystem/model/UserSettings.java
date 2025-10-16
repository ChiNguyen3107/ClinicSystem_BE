package vn.project.ClinicSystem.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_settings")
public class UserSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "language")
    private String language = "vi"; // vi, en

    @Column(name = "timezone")
    private String timezone = "Asia/Ho_Chi_Minh";

    @Column(name = "date_format")
    private String dateFormat = "dd/MM/yyyy";

    @Column(name = "time_format")
    private String timeFormat = "24h"; // 12h, 24h

    @Column(name = "theme")
    private String theme = "light"; // light, dark

    @Column(name = "notification_enabled")
    private Boolean notificationEnabled = true;

    @Column(name = "email_notification_enabled")
    private Boolean emailNotificationEnabled = true;

    @Column(name = "sms_notification_enabled")
    private Boolean smsNotificationEnabled = false;

    @Column(name = "appointment_reminder")
    private Boolean appointmentReminder = true;

    @Column(name = "appointment_reminder_time")
    private Integer appointmentReminderTime = 30; // phút trước

    @Column(name = "prescription_reminder")
    private Boolean prescriptionReminder = true;

    @Column(name = "billing_notification")
    private Boolean billingNotification = true;

    @Column(name = "dashboard_layout")
    private String dashboardLayout = "default";

    @Column(name = "items_per_page")
    private Integer itemsPerPage = 10;

    @Column(name = "auto_refresh")
    private Boolean autoRefresh = true;

    @Column(name = "auto_refresh_interval")
    private Integer autoRefreshInterval = 30; // giây

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public UserSettings() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public UserSettings(Long userId) {
        this();
        this.userId = userId;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public String getDateFormat() {
        return dateFormat;
    }

    public void setDateFormat(String dateFormat) {
        this.dateFormat = dateFormat;
    }

    public String getTimeFormat() {
        return timeFormat;
    }

    public void setTimeFormat(String timeFormat) {
        this.timeFormat = timeFormat;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
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

    public Boolean getAppointmentReminder() {
        return appointmentReminder;
    }

    public void setAppointmentReminder(Boolean appointmentReminder) {
        this.appointmentReminder = appointmentReminder;
    }

    public Integer getAppointmentReminderTime() {
        return appointmentReminderTime;
    }

    public void setAppointmentReminderTime(Integer appointmentReminderTime) {
        this.appointmentReminderTime = appointmentReminderTime;
    }

    public Boolean getPrescriptionReminder() {
        return prescriptionReminder;
    }

    public void setPrescriptionReminder(Boolean prescriptionReminder) {
        this.prescriptionReminder = prescriptionReminder;
    }

    public Boolean getBillingNotification() {
        return billingNotification;
    }

    public void setBillingNotification(Boolean billingNotification) {
        this.billingNotification = billingNotification;
    }

    public String getDashboardLayout() {
        return dashboardLayout;
    }

    public void setDashboardLayout(String dashboardLayout) {
        this.dashboardLayout = dashboardLayout;
    }

    public Integer getItemsPerPage() {
        return itemsPerPage;
    }

    public void setItemsPerPage(Integer itemsPerPage) {
        this.itemsPerPage = itemsPerPage;
    }

    public Boolean getAutoRefresh() {
        return autoRefresh;
    }

    public void setAutoRefresh(Boolean autoRefresh) {
        this.autoRefresh = autoRefresh;
    }

    public Integer getAutoRefreshInterval() {
        return autoRefreshInterval;
    }

    public void setAutoRefreshInterval(Integer autoRefreshInterval) {
        this.autoRefreshInterval = autoRefreshInterval;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
