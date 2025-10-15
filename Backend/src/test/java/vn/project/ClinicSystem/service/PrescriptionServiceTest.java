package vn.project.ClinicSystem.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import vn.project.ClinicSystem.model.Appointment;
import vn.project.ClinicSystem.model.Doctor;
import vn.project.ClinicSystem.model.Medication;
import vn.project.ClinicSystem.model.MedicationBatch;
import vn.project.ClinicSystem.model.Patient;
import vn.project.ClinicSystem.model.PatientVisit;
import vn.project.ClinicSystem.model.Prescription;
import vn.project.ClinicSystem.model.dto.PrescriptionCreateRequest;
import vn.project.ClinicSystem.model.dto.PrescriptionItemRequest;
import vn.project.ClinicSystem.repository.DoctorRepository;
import vn.project.ClinicSystem.repository.MedicationBatchRepository;
import vn.project.ClinicSystem.repository.MedicationRepository;
import vn.project.ClinicSystem.repository.PatientVisitRepository;
import vn.project.ClinicSystem.repository.PrescriptionRepository;
import vn.project.ClinicSystem.repository.ServiceIndicatorRepository;
import vn.project.ClinicSystem.repository.ServiceOrderRepository;

@ExtendWith(MockitoExtension.class)
class PrescriptionServiceTest {

    @Mock
    private PrescriptionRepository prescriptionRepository;
    @Mock
    private PatientVisitRepository patientVisitRepository;
    @Mock
    private DoctorRepository doctorRepository;
    @Mock
    private MedicationRepository medicationRepository;
    @Mock
    private MedicationBatchRepository medicationBatchRepository;
    @Mock
    private ServiceOrderRepository serviceOrderRepository;
    @Mock
    private ServiceIndicatorRepository serviceIndicatorRepository;
    @Mock
    private Validator validator;

    @InjectMocks
    private PrescriptionService prescriptionService;

    private PatientVisit visit;
    private Medication medication;
    private MedicationBatch batch;

    @BeforeEach
    void init() {
        Patient patient = new Patient();
        patient.setId(10L);

        Doctor doctor = new Doctor();
        doctor.setId(3L);

        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);

        visit = new PatientVisit();
        visit.setId(1L);
        visit.setPatient(patient);
        visit.setPrimaryAppointment(appointment);

        medication = new Medication();
        medication.setId(5L);
        medication.setName("Ferrovit");
        medication.setStockQuantity(100);

        batch = new MedicationBatch();
        batch.setId(7L);
        batch.setMedication(medication);
        batch.setQuantityOnHand(40);
        batch.setUnitPrice(new BigDecimal("5000"));
    }

    @Test
    void create_shouldDeductInventoryAndPersistPrescription() {
        PrescriptionItemRequest itemRequest = new PrescriptionItemRequest();
        itemRequest.setMedicationId(5L);
        itemRequest.setBatchId(7L);
        itemRequest.setQuantity(10);
        itemRequest.setDosage("1 viên");
        itemRequest.setFrequency("Ngày 2 lần");
        itemRequest.setDuration("5 ngày");
        itemRequest.setInstruction("Sau ăn");
        itemRequest.setMedicationName("Ferrovit");

        PrescriptionCreateRequest request = new PrescriptionCreateRequest();
        request.setVisitId(1L);
        request.setIssuedAt(LocalDateTime.now());
        request.setItems(Collections.singletonList(itemRequest));

        when(patientVisitRepository.findById(1L)).thenReturn(Optional.of(visit));
        when(serviceOrderRepository.findByVisitId(1L)).thenReturn(Collections.emptyList());
        when(medicationRepository.findById(5L)).thenReturn(Optional.of(medication));
        when(medicationBatchRepository.findById(7L)).thenReturn(Optional.of(batch));
        when(prescriptionRepository.save(any(Prescription.class)))
                .thenAnswer(invocation -> invocation.getArgument(0, Prescription.class));
        when(medicationBatchRepository.save(any(MedicationBatch.class))).thenReturn(batch);
        when(medicationRepository.save(any(Medication.class))).thenReturn(medication);
        when(validator.validate(any(Prescription.class))).thenReturn(Set.<ConstraintViolation<Prescription>>of());

        Prescription saved = prescriptionService.create(request);

        assertThat(saved.getItems()).hasSize(1);
        var savedItem = saved.getItems().get(0);
        assertThat(savedItem.getQuantity()).isEqualTo(10);
        assertThat(savedItem.getUnitPriceSnapshot()).isEqualByComparingTo("5000.00");
        assertThat(savedItem.getAmount()).isEqualByComparingTo("50000.00");
        assertThat(savedItem.getMedicationBatch().getId()).isEqualTo(7L);

        // tồn kho đã bị trừ
        assertThat(batch.getQuantityOnHand()).isEqualTo(30);
        assertThat(medication.getStockQuantity()).isEqualTo(90);

        verify(prescriptionRepository).save(any(Prescription.class));
        verify(medicationBatchRepository).save(eq(batch));
        verify(medicationRepository).save(eq(medication));
    }
}
