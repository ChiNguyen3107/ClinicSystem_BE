package vn.project.ClinicSystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.project.ClinicSystem.model.dto.*;
import vn.project.ClinicSystem.service.DashboardService;
import vn.project.ClinicSystem.util.ResponseUtil;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    /**
     * Lấy thống kê tổng quan dashboard
     * GET /dashboard/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            DashboardStatsDTO stats = dashboardService.getDashboardStats();
            return ResponseUtil.success(stats, "Lấy thống kê dashboard thành công");
        } catch (Exception e) {
            return ResponseUtil.error("Lỗi khi lấy thống kê dashboard: " + e.getMessage());
        }
    }

    /**
     * Lấy dữ liệu biểu đồ
     * GET /dashboard/charts
     */
    @GetMapping("/charts")
    public ResponseEntity<?> getChartData() {
        try {
            ChartDataDTO chartData = dashboardService.getChartData();
            return ResponseUtil.success(chartData, "Lấy dữ liệu biểu đồ thành công");
        } catch (Exception e) {
            return ResponseUtil.error("Lỗi khi lấy dữ liệu biểu đồ: " + e.getMessage());
        }
    }

    /**
     * Lấy lịch hẹn hôm nay
     * GET /dashboard/appointments-today
     */
    @GetMapping("/appointments-today")
    public ResponseEntity<?> getTodayAppointments() {
        try {
            List<AppointmentSummaryDTO> appointments = dashboardService.getTodayAppointments();
            return ResponseUtil.success(appointments, "Lấy lịch hẹn hôm nay thành công");
        } catch (Exception e) {
            return ResponseUtil.error("Lỗi khi lấy lịch hẹn hôm nay: " + e.getMessage());
        }
    }

    /**
     * Lấy lịch hẹn sắp tới (7 ngày tới)
     * GET /dashboard/upcoming-appointments
     */
    @GetMapping("/upcoming-appointments")
    public ResponseEntity<?> getUpcomingAppointments() {
        try {
            List<AppointmentSummaryDTO> appointments = dashboardService.getUpcomingAppointments();
            return ResponseUtil.success(appointments, "Lấy lịch hẹn sắp tới thành công");
        } catch (Exception e) {
            return ResponseUtil.error("Lỗi khi lấy lịch hẹn sắp tới: " + e.getMessage());
        }
    }

    /**
     * Lấy nhiệm vụ chờ xử lý
     * GET /dashboard/pending-tasks
     */
    @GetMapping("/pending-tasks")
    public ResponseEntity<?> getPendingTasks() {
        try {
            List<AppointmentSummaryDTO> tasks = dashboardService.getPendingTasks();
            return ResponseUtil.success(tasks, "Lấy nhiệm vụ chờ xử lý thành công");
        } catch (Exception e) {
            return ResponseUtil.error("Lỗi khi lấy nhiệm vụ chờ xử lý: " + e.getMessage());
        }
    }
}
