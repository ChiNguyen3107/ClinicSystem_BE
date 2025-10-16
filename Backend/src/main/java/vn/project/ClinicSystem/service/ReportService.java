package vn.project.ClinicSystem.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vn.project.ClinicSystem.model.dto.*;
import vn.project.ClinicSystem.model.Patient;
import vn.project.ClinicSystem.model.Appointment;
import vn.project.ClinicSystem.model.BillingItem;
import vn.project.ClinicSystem.repository.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Period;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ReportService {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final ServiceOrderRepository serviceOrderRepository;
    private final DoctorRepository doctorRepository;
    private final MedicalServiceRepository medicalServiceRepository;
    private final BillingItemRepository billingItemRepository;

    public ReportService(PatientRepository patientRepository,
                       AppointmentRepository appointmentRepository,
                       ServiceOrderRepository serviceOrderRepository,
                       DoctorRepository doctorRepository,
                       MedicalServiceRepository medicalServiceRepository,
                       BillingItemRepository billingItemRepository) {
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.serviceOrderRepository = serviceOrderRepository;
        this.doctorRepository = doctorRepository;
        this.medicalServiceRepository = medicalServiceRepository;
        this.billingItemRepository = billingItemRepository;
    }

    /**
     * Tạo báo cáo bệnh nhân
     */
    public PatientReportDTO generatePatientReport(String gender, String address, String ageGroup) {
        List<Patient> patients = patientRepository.findAll();
        
        // Lọc theo điều kiện
        if (gender != null && !gender.isEmpty()) {
            patients = patients.stream()
                .filter(p -> gender.equalsIgnoreCase(p.getGender()))
                .collect(Collectors.toList());
        }
        
        if (address != null && !address.isEmpty()) {
            patients = patients.stream()
                .filter(p -> p.getAddress() != null && p.getAddress().contains(address))
                .collect(Collectors.toList());
        }

        // Thống kê theo độ tuổi
        List<PatientReportDTO.AgeGroupStats> ageGroupStats = calculateAgeGroupStats(patients);
        
        // Thống kê theo giới tính
        List<PatientReportDTO.GenderStats> genderStats = calculateGenderStats(patients);
        
        // Thống kê theo địa chỉ
        List<PatientReportDTO.AddressStats> addressStats = calculateAddressStats(patients);

        return new PatientReportDTO(ageGroupStats, genderStats, addressStats, (long) patients.size());
    }

    /**
     * Tạo báo cáo lịch hẹn
     */
    public AppointmentReportDTO generateAppointmentReport(Long doctorId, LocalDate startDate, 
                                                        LocalDate endDate, String status) {
        List<Appointment> appointments = appointmentRepository.findAll();
        
        // Lọc theo điều kiện
        if (doctorId != null) {
            appointments = appointments.stream()
                .filter(a -> a.getDoctor() != null && a.getDoctor().getId().equals(doctorId))
                .collect(Collectors.toList());
        }
        
        if (startDate != null) {
            appointments = appointments.stream()
                .filter(a -> a.getScheduledAt() != null && !a.getScheduledAt().toLocalDate().isBefore(startDate))
                .collect(Collectors.toList());
        }
        
        if (endDate != null) {
            appointments = appointments.stream()
                .filter(a -> a.getScheduledAt() != null && !a.getScheduledAt().toLocalDate().isAfter(endDate))
                .collect(Collectors.toList());
        }
        
        if (status != null && !status.isEmpty()) {
            appointments = appointments.stream()
                .filter(a -> a.getStatus() != null && status.equalsIgnoreCase(a.getStatus().toString()))
                .collect(Collectors.toList());
        }

        // Thống kê theo bác sĩ
        List<AppointmentReportDTO.DoctorStats> doctorStats = calculateDoctorStats(appointments);
        
        // Thống kê theo thời gian
        List<AppointmentReportDTO.TimeStats> timeStats = calculateTimeStats(appointments);
        
        // Thống kê theo trạng thái
        List<AppointmentReportDTO.StatusStats> statusStats = calculateStatusStats(appointments);

        return new AppointmentReportDTO(doctorStats, timeStats, statusStats, (long) appointments.size());
    }

    /**
     * Tạo báo cáo tài chính
     */
    public BillingReportDTO generateBillingReport(LocalDate startDate, LocalDate endDate, Long doctorId) {
        List<BillingItem> billingItems = billingItemRepository.findAll();
        
        // Lọc theo điều kiện
        if (startDate != null) {
            billingItems = billingItems.stream()
                .filter(bi -> bi.getCreatedAt() != null && !bi.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).toLocalDate().isBefore(startDate))
                .collect(Collectors.toList());
        }
        
        if (endDate != null) {
            billingItems = billingItems.stream()
                .filter(bi -> bi.getCreatedAt() != null && !bi.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).toLocalDate().isAfter(endDate))
                .collect(Collectors.toList());
        }

        // Thống kê doanh thu theo tháng
        List<BillingReportDTO.MonthlyRevenue> monthlyRevenue = calculateMonthlyRevenue(billingItems);
        
        // Thống kê doanh thu theo dịch vụ
        List<BillingReportDTO.ServiceRevenue> serviceRevenue = calculateServiceRevenue(billingItems);
        
        // Thống kê doanh thu theo bác sĩ
        List<BillingReportDTO.DoctorRevenue> doctorRevenue = calculateDoctorRevenue(billingItems, doctorId);

        BigDecimal totalRevenue = billingItems.stream()
            .map(BillingItem::getAmount)
            .filter(Objects::nonNull)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal averageRevenue = billingItems.isEmpty() ? BigDecimal.ZERO : 
            totalRevenue.divide(BigDecimal.valueOf(billingItems.size()), 2, RoundingMode.HALF_UP);

        return new BillingReportDTO(monthlyRevenue, serviceRevenue, doctorRevenue, totalRevenue, averageRevenue);
    }

    /**
     * Xuất báo cáo ra file
     */
    public byte[] exportReport(ExportRequestDTO request) {
        // TODO: Implement file export logic
        // This would involve creating Excel, PDF, or CSV files based on the request
        // For now, return empty byte array
        return new byte[0];
    }

    // Helper methods for calculations

    private List<PatientReportDTO.AgeGroupStats> calculateAgeGroupStats(List<Patient> patients) {
        Map<String, Long> ageGroups = patients.stream()
            .filter(p -> p.getDateOfBirth() != null)
            .collect(Collectors.groupingBy(
                p -> getAgeGroup(Period.between(p.getDateOfBirth(), LocalDate.now()).getYears()),
                Collectors.counting()
            ));

        long total = patients.size();
        return ageGroups.entrySet().stream()
            .map(entry -> new PatientReportDTO.AgeGroupStats(
                entry.getKey(),
                entry.getValue(),
                total > 0 ? (double) entry.getValue() / total * 100 : 0.0
            ))
            .collect(Collectors.toList());
    }

    private String getAgeGroup(int age) {
        if (age < 18) return "Dưới 18 tuổi";
        if (age < 30) return "18-29 tuổi";
        if (age < 45) return "30-44 tuổi";
        if (age < 60) return "45-59 tuổi";
        return "Trên 60 tuổi";
    }

    private List<PatientReportDTO.GenderStats> calculateGenderStats(List<Patient> patients) {
        Map<String, Long> genderCounts = patients.stream()
            .filter(p -> p.getGender() != null)
            .collect(Collectors.groupingBy(Patient::getGender, Collectors.counting()));

        long total = patients.size();
        return genderCounts.entrySet().stream()
            .map(entry -> new PatientReportDTO.GenderStats(
                entry.getKey(),
                entry.getValue(),
                total > 0 ? (double) entry.getValue() / total * 100 : 0.0
            ))
            .collect(Collectors.toList());
    }

    private List<PatientReportDTO.AddressStats> calculateAddressStats(List<Patient> patients) {
        Map<String, Long> addressCounts = patients.stream()
            .filter(p -> p.getAddress() != null && !p.getAddress().trim().isEmpty())
            .collect(Collectors.groupingBy(Patient::getAddress, Collectors.counting()));

        long total = patients.size();
        return addressCounts.entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .limit(10) // Top 10 địa chỉ
            .map(entry -> new PatientReportDTO.AddressStats(
                entry.getKey(),
                entry.getValue(),
                total > 0 ? (double) entry.getValue() / total * 100 : 0.0
            ))
            .collect(Collectors.toList());
    }

    private List<AppointmentReportDTO.DoctorStats> calculateDoctorStats(List<Appointment> appointments) {
        Map<String, Map<String, Long>> doctorStats = appointments.stream()
            .filter(a -> a.getDoctor() != null)
            .collect(Collectors.groupingBy(
                a -> a.getDoctor().getAccount() != null ? a.getDoctor().getAccount().getFullName() : "Unknown",
                Collectors.groupingBy(
                    a -> a.getDoctor().getSpecialty(),
                    Collectors.counting()
                )
            ));

        long total = appointments.size();
        return doctorStats.entrySet().stream()
            .map(entry -> {
                String doctorName = entry.getKey();
                Map<String, Long> specialties = entry.getValue();
                String specialty = specialties.entrySet().iterator().next().getKey();
                Long count = specialties.values().stream().mapToLong(Long::longValue).sum();
                
                return new AppointmentReportDTO.DoctorStats(
                    doctorName,
                    specialty,
                    count,
                    total > 0 ? (double) count / total * 100 : 0.0
                );
            })
            .sorted((a, b) -> Long.compare(b.getAppointmentCount(), a.getAppointmentCount()))
            .collect(Collectors.toList());
    }

    private List<AppointmentReportDTO.TimeStats> calculateTimeStats(List<Appointment> appointments) {
        Map<LocalDate, Long> dateCounts = appointments.stream()
            .filter(a -> a.getScheduledAt() != null)
            .collect(Collectors.groupingBy(a -> a.getScheduledAt().toLocalDate(), Collectors.counting()));

        return dateCounts.entrySet().stream()
            .map(entry -> new AppointmentReportDTO.TimeStats(
                entry.getKey(),
                entry.getValue(),
                entry.getKey().getDayOfWeek().toString()
            ))
            .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
            .limit(30) // 30 ngày gần nhất
            .collect(Collectors.toList());
    }

    private List<AppointmentReportDTO.StatusStats> calculateStatusStats(List<Appointment> appointments) {
        Map<String, Long> statusCounts = appointments.stream()
            .filter(a -> a.getStatus() != null)
            .collect(Collectors.groupingBy(a -> a.getStatus().toString(), Collectors.counting()));

        long total = appointments.size();
        return statusCounts.entrySet().stream()
            .map(entry -> new AppointmentReportDTO.StatusStats(
                entry.getKey(),
                entry.getValue(),
                total > 0 ? (double) entry.getValue() / total * 100 : 0.0
            ))
            .collect(Collectors.toList());
    }

    private List<BillingReportDTO.MonthlyRevenue> calculateMonthlyRevenue(List<BillingItem> billingItems) {
        Map<String, Map<Integer, BigDecimal>> monthlyData = billingItems.stream()
            .filter(bi -> bi.getCreatedAt() != null && bi.getAmount() != null)
            .collect(Collectors.groupingBy(
                bi -> bi.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).getMonth().toString(),
                Collectors.groupingBy(
                    bi -> bi.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).getYear(),
                    Collectors.reducing(BigDecimal.ZERO, BillingItem::getAmount, BigDecimal::add)
                )
            ));

        return monthlyData.entrySet().stream()
            .flatMap(monthEntry -> monthEntry.getValue().entrySet().stream()
                .map(yearEntry -> new BillingReportDTO.MonthlyRevenue(
                    monthEntry.getKey(),
                    yearEntry.getKey(),
                    yearEntry.getValue(),
                    billingItems.stream()
                        .filter(bi -> bi.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).getMonth().toString().equals(monthEntry.getKey()) &&
                                     bi.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).getYear() == yearEntry.getKey())
                        .count()
                )))
            .collect(Collectors.toList());
    }

    private List<BillingReportDTO.ServiceRevenue> calculateServiceRevenue(List<BillingItem> billingItems) {
        // This would need to be implemented based on your BillingItem structure
        // For now, return empty list
        return new ArrayList<>();
    }

    private List<BillingReportDTO.DoctorRevenue> calculateDoctorRevenue(List<BillingItem> billingItems, Long doctorId) {
        // This would need to be implemented based on your BillingItem structure
        // For now, return empty list
        return new ArrayList<>();
    }
}
