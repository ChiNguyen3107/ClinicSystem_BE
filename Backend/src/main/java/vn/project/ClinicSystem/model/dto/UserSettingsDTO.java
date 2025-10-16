package vn.project.ClinicSystem.model.dto;

public class UserSettingsDTO {
    private Long id;
    private Long userId;
    private String language;
    private String timezone;
    private String dateFormat;
    private String timeFormat;
    private String theme;
    private Boolean notificationEnabled;
    private Boolean emailNotificationEnabled;
    private Boolean smsNotificationEnabled;
    private Boolean appointmentReminder;
    private Integer appointmentReminderTime;
    private Boolean prescriptionReminder;
    private Boolean billingNotification;
    private String dashboardLayout;
    private Integer itemsPerPage;
    private Boolean autoRefresh;
    private Integer autoRefreshInterval;

    // Constructors
    public UserSettingsDTO() {}

    public UserSettingsDTO(Long id, Long userId, String language, String timezone, String dateFormat,
                          String timeFormat, String theme, Boolean notificationEnabled,
                          Boolean emailNotificationEnabled, Boolean smsNotificationEnabled,
                          Boolean appointmentReminder, Integer appointmentReminderTime,
                          Boolean prescriptionReminder, Boolean billingNotification,
                          String dashboardLayout, Integer itemsPerPage, Boolean autoRefresh,
                          Integer autoRefreshInterval) {
        this.id = id;
        this.userId = userId;
        this.language = language;
        this.timezone = timezone;
        this.dateFormat = dateFormat;
        this.timeFormat = timeFormat;
        this.theme = theme;
        this.notificationEnabled = notificationEnabled;
        this.emailNotificationEnabled = emailNotificationEnabled;
        this.smsNotificationEnabled = smsNotificationEnabled;
        this.appointmentReminder = appointmentReminder;
        this.appointmentReminderTime = appointmentReminderTime;
        this.prescriptionReminder = prescriptionReminder;
        this.billingNotification = billingNotification;
        this.dashboardLayout = dashboardLayout;
        this.itemsPerPage = itemsPerPage;
        this.autoRefresh = autoRefresh;
        this.autoRefreshInterval = autoRefreshInterval;
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
}
