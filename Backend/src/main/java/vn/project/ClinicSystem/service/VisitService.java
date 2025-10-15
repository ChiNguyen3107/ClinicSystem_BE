package vn.project.ClinicSystem.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import vn.project.ClinicSystem.model.Appointment;
import vn.project.ClinicSystem.model.Doctor;
import vn.project.ClinicSystem.model.MedicalService;
import vn.project.ClinicSystem.model.PatientVisit;
import vn.project.ClinicSystem.model.ServiceOrder;
import vn.project.ClinicSystem.model.dto.PatientVisitCreateRequest;
import vn.project.ClinicSystem.model.dto.PatientVisitStatusUpdateRequest;
import vn.project.ClinicSystem.model.dto.ServiceOrderCreateRequest;
import vn.project.ClinicSystem.model.dto.ServiceOrderStatusUpdateRequest;
import vn.project.ClinicSystem.model.enums.ServiceOrderStatus;
import vn.project.ClinicSystem.model.enums.VisitStatus;
import vn.project.ClinicSystem.repository.DoctorRepository;
import vn.project.ClinicSystem.repository.MedicalServiceRepository;
import vn.project.ClinicSystem.repository.PatientVisitRepository;
import vn.project.ClinicSystem.repository.ServiceOrderRepository;

@Service
@Transactional(readOnly = true)
public class VisitService {

    private final PatientVisitRepository patientVisitRepository;
    private final ServiceOrderRepository serviceOrderRepository;
    private final AppointmentService appointmentService;
    private final MedicalServiceRepository medicalServiceRepository;
    private final DoctorRepository doctorRepository;

    public VisitService(PatientVisitRepository patientVisitRepository,
            ServiceOrderRepository serviceOrderRepository,
            AppointmentService appointmentService,
            MedicalServiceRepository medicalServiceRepository,
            DoctorRepository doctorRepository) {
        this.patientVisitRepository = patientVisitRepository;
        this.serviceOrderRepository = serviceOrderRepository;
        this.appointmentService = appointmentService;
        this.medicalServiceRepository = medicalServiceRepository;
        this.doctorRepository = doctorRepository;
    }

    public PatientVisit getById(Long id) {
        return patientVisitRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy hồ sơ khám với id: " + id));
    }

    public List<PatientVisit> findByPatient(Long patientId) {
        return patientVisitRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }

    public List<PatientVisit> findAll() {
        return patientVisitRepository.findAll();
    }

    public List<ServiceOrder> findServiceOrders(Long visitId) {
        ensureVisitExists(visitId);
        return serviceOrderRepository.findByVisitId(visitId);
    }

    @Transactional
    public PatientVisit createVisit(PatientVisitCreateRequest request) {
        Appointment primaryAppointment = appointmentService.getById(request.getPrimaryAppointmentId());

        if (patientVisitRepository.existsByPrimaryAppointmentId(primaryAppointment.getId())) {
            throw new IllegalStateException("Lịch khám này đã có hồ sơ khám");
        }
        if (primaryAppointment.getPatient() == null) {
            throw new IllegalStateException("Lịch khám chưa gắn bệnh nhân, không thể tạo hồ sơ khám");
        }

        PatientVisit visit = new PatientVisit();
        visit.setPrimaryAppointment(primaryAppointment);
        visit.setPatient(primaryAppointment.getPatient());
        visit.setProvisionalDiagnosis(request.getProvisionalDiagnosis());
        visit.setClinicalNote(request.getClinicalNote());
        visit.setStatus(VisitStatus.OPEN);
        return patientVisitRepository.save(visit);
    }

    @Transactional
    public List<ServiceOrder> createServiceOrders(Long visitId,
            List<ServiceOrderCreateRequest> requests) {

        if (requests == null || requests.isEmpty()) {
            throw new IllegalArgumentException("Danh sách dịch vụ không được để trống");
        }

        PatientVisit visit = getById(visitId);
        if (visit.getStatus() != VisitStatus.OPEN) {
            throw new IllegalStateException("Hồ sơ khám không ở trạng thái mở");
        }

        List<ServiceOrder> createdOrders = new ArrayList<>();
        for (ServiceOrderCreateRequest item : requests) {
            createdOrders.add(createSingleOrder(visit, item));
        }
        return createdOrders;
    }

    @Transactional
    public PatientVisit updateStatus(Long visitId, PatientVisitStatusUpdateRequest request) {
        PatientVisit visit = getById(visitId);

        if (request.getStatus() == VisitStatus.COMPLETED) {
            boolean hasPending = !serviceOrderRepository.findByVisitIdAndStatus(visitId, ServiceOrderStatus.PENDING)
                    .isEmpty();
            boolean hasScheduled = !serviceOrderRepository
                    .findByVisitIdAndStatus(visitId, ServiceOrderStatus.SCHEDULED)
                    .isEmpty();
            boolean hasInProgress = !serviceOrderRepository
                    .findByVisitIdAndStatus(visitId, ServiceOrderStatus.IN_PROGRESS)
                    .isEmpty();
            if (hasPending || hasScheduled || hasInProgress) {
                throw new IllegalStateException("Không thể hoàn tất hồ sơ khi vẫn còn phiếu dịch vụ chưa xử lý.");
            }
        }

        visit.setStatus(request.getStatus());
        return patientVisitRepository.save(visit);
    }

    @Transactional
    public ServiceOrder updateServiceOrderStatus(Long orderId, ServiceOrderStatusUpdateRequest request) {
        ServiceOrder order = serviceOrderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phiếu dịch vụ với id: " + orderId));

        order.setStatus(request.getStatus());
        order.setResultNote(request.getResultNote());

        return serviceOrderRepository.save(order);
    }

    private ServiceOrder createSingleOrder(PatientVisit visit,
            ServiceOrderCreateRequest request) {

        MedicalService medicalService = medicalServiceRepository.findById(request.getMedicalServiceId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy dịch vụ với id: " + request.getMedicalServiceId()));

        Doctor doctor = doctorRepository.findById(request.getAssignedDoctorId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy bác sĩ với id: " + request.getAssignedDoctorId()));

        ServiceOrder order = new ServiceOrder();
        order.setVisit(visit);
        order.setMedicalService(medicalService);
        order.setAssignedDoctor(doctor);
        order.setStatus(ServiceOrderStatus.PENDING);
        order.setNote(request.getNote());

        return serviceOrderRepository.save(order);
    }

    private void ensureVisitExists(Long visitId) {
        if (!patientVisitRepository.existsById(visitId)) {
            throw new EntityNotFoundException("Không tìm thấy hồ sơ khám với id: " + visitId);
        }
    }
}
