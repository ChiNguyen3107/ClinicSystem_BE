package vn.project.ClinicSystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.project.ClinicSystem.model.dto.*;
import vn.project.ClinicSystem.repository.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private DoctorRepository doctorRepository;
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private BillingRepository billingRepository;
    
    @Autowired
    private PatientVisitRepository patientVisitRepository;
    
    @Autowired
    private MedicalServiceRepository medicalServiceRepository;

    public DashboardStatsDTO getDashboardStats() {
        Long totalPatients = patientRepository.count();
        Long totalDoctors = doctorRepository.count();
        
        LocalDate today = LocalDate.now();
        Long todayAppointments = appointmentRepository.countByAppointmentDate(today);
        
        // Tính doanh thu tháng này
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate endOfMonth = today.withDayOfMonth(today.lengthOfMonth());
        Double monthlyRevenue = billingRepository.calculateRevenueByDateRange(startOfMonth, endOfMonth);
        
        // Đếm số phiên khám đang mở (status = OPEN)
        Long openVisits = patientVisitRepository.countByStatus("OPEN");
        
        return new DashboardStatsDTO(totalPatients, totalDoctors, todayAppointments, 
                                   monthlyRevenue != null ? monthlyRevenue : 0.0, openVisits);
    }

    public ChartDataDTO getChartData() {
        // Biểu đồ doanh thu theo tháng (6 tháng gần nhất)
        List<ChartDataDTO.MonthlyRevenueData> monthlyRevenue = getMonthlyRevenueData();
        
        // Biểu đồ số bệnh nhân theo tháng (6 tháng gần nhất)
        List<ChartDataDTO.MonthlyPatientData> monthlyPatients = getMonthlyPatientData();
        
        // Biểu đồ lịch hẹn theo trạng thái
        List<ChartDataDTO.AppointmentStatusData> appointmentStatus = getAppointmentStatusData();
        
        // Biểu đồ dịch vụ phổ biến
        List<ChartDataDTO.PopularServiceData> popularServices = getPopularServiceData();
        
        return new ChartDataDTO(monthlyRevenue, monthlyPatients, appointmentStatus, popularServices);
    }

    public List<AppointmentSummaryDTO> getTodayAppointments() {
        LocalDate today = LocalDate.now();
        return appointmentRepository.findByAppointmentDate(today)
                .stream()
                .map(appointment -> new AppointmentSummaryDTO(
                    appointment.getId(),
                    appointment.getPatient().getFullName(),
                    appointment.getDoctor().getAccount().getFullName(),
                    appointment.getScheduledAt(),
                    appointment.getStatus().toString(),
                    appointment.getClinicRoom() != null ? appointment.getClinicRoom().getName() : "Chưa xác định",
                    appointment.getNotes()
                ))
                .collect(Collectors.toList());
    }

    public List<AppointmentSummaryDTO> getUpcomingAppointments() {
        LocalDate today = LocalDate.now();
        LocalDate nextWeek = today.plusDays(7);
        
        return appointmentRepository.findByAppointmentDateBetween(today.plusDays(1), nextWeek)
                .stream()
                .map(appointment -> new AppointmentSummaryDTO(
                    appointment.getId(),
                    appointment.getPatient().getFullName(),
                    appointment.getDoctor().getAccount().getFullName(),
                    appointment.getScheduledAt(),
                    appointment.getStatus().toString(),
                    appointment.getClinicRoom() != null ? appointment.getClinicRoom().getName() : "Chưa xác định",
                    appointment.getNotes()
                ))
                .collect(Collectors.toList());
    }

    public List<AppointmentSummaryDTO> getPendingTasks() {
        // Lấy các lịch hẹn có trạng thái PENDING
        return appointmentRepository.findByStatus("PENDING")
                .stream()
                .map(appointment -> new AppointmentSummaryDTO(
                    appointment.getId(),
                    appointment.getPatient().getFullName(),
                    appointment.getDoctor().getAccount().getFullName(),
                    appointment.getScheduledAt(),
                    appointment.getStatus().toString(),
                    appointment.getClinicRoom() != null ? appointment.getClinicRoom().getName() : "Chưa xác định",
                    appointment.getNotes()
                ))
                .collect(Collectors.toList());
    }

    private List<ChartDataDTO.MonthlyRevenueData> getMonthlyRevenueData() {
        List<ChartDataDTO.MonthlyRevenueData> data = new ArrayList<>();
        LocalDate today = LocalDate.now();
        
        for (int i = 5; i >= 0; i--) {
            LocalDate monthStart = today.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());
            
            Double revenue = billingRepository.calculateRevenueByDateRange(monthStart, monthEnd);
            String monthName = monthStart.format(DateTimeFormatter.ofPattern("MM/yyyy"));
            
            data.add(new ChartDataDTO.MonthlyRevenueData(monthName, revenue != null ? revenue : 0.0));
        }
        
        return data;
    }

    private List<ChartDataDTO.MonthlyPatientData> getMonthlyPatientData() {
        List<ChartDataDTO.MonthlyPatientData> data = new ArrayList<>();
        LocalDate today = LocalDate.now();
        
        for (int i = 5; i >= 0; i--) {
            LocalDate monthStart = today.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());
            
            Long patientCount = patientRepository.countByCreatedDateBetween(monthStart, monthEnd);
            String monthName = monthStart.format(DateTimeFormatter.ofPattern("MM/yyyy"));
            
            data.add(new ChartDataDTO.MonthlyPatientData(monthName, patientCount));
        }
        
        return data;
    }

    private List<ChartDataDTO.AppointmentStatusData> getAppointmentStatusData() {
        List<ChartDataDTO.AppointmentStatusData> data = new ArrayList<>();
        
        // Đếm theo từng trạng thái
        data.add(new ChartDataDTO.AppointmentStatusData("PENDING", appointmentRepository.countByStatus("PENDING")));
        data.add(new ChartDataDTO.AppointmentStatusData("CONFIRMED", appointmentRepository.countByStatus("CONFIRMED")));
        data.add(new ChartDataDTO.AppointmentStatusData("COMPLETED", appointmentRepository.countByStatus("COMPLETED")));
        data.add(new ChartDataDTO.AppointmentStatusData("CANCELLED", appointmentRepository.countByStatus("CANCELLED")));
        
        return data;
    }

    private List<ChartDataDTO.PopularServiceData> getPopularServiceData() {
        // Lấy top 5 dịch vụ phổ biến nhất
        return medicalServiceRepository.findTop5ByOrderByUsageCountDesc()
                .stream()
                .map(service -> new ChartDataDTO.PopularServiceData(
                    service.getName(),
                    service.getUsageCount() != null ? service.getUsageCount() : 0L
                ))
                .collect(Collectors.toList());
    }
}
