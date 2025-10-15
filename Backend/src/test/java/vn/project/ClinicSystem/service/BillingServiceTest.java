package vn.project.ClinicSystem.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;


import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import vn.project.ClinicSystem.model.Billing;
import vn.project.ClinicSystem.model.Patient;
import vn.project.ClinicSystem.model.PatientVisit;
import vn.project.ClinicSystem.model.Prescription;
import vn.project.ClinicSystem.model.PrescriptionItem;
import vn.project.ClinicSystem.model.ServiceOrder;
import vn.project.ClinicSystem.model.enums.BillingItemType;
import vn.project.ClinicSystem.model.enums.ServiceOrderStatus;
import vn.project.ClinicSystem.repository.BillingItemRepository;
import vn.project.ClinicSystem.repository.BillingRepository;
import vn.project.ClinicSystem.repository.PatientVisitRepository;
import vn.project.ClinicSystem.repository.PrescriptionRepository;
import vn.project.ClinicSystem.repository.ServiceOrderRepository;

@ExtendWith(MockitoExtension.class)
class BillingServiceTest {

    @Mock
    private BillingRepository billingRepository;
    @Mock
    private BillingItemRepository billingItemRepository;
    @Mock
    private PatientVisitRepository patientVisitRepository;
    @Mock
    private ServiceOrderRepository serviceOrderRepository;
    @Mock
    private PrescriptionRepository prescriptionRepository;

    @InjectMocks
    private BillingService billingService;

    private PatientVisit visit;

    @BeforeEach
    void setUp() {
        Patient patient = new Patient();
        patient.setId(20L);

        visit = new PatientVisit();
        visit.setId(2L);
        visit.setPatient(patient);
    }

    @Test
    void generateForVisit_shouldCreateBillingWithServiceAndMedicationTotals() {
        ServiceOrder serviceOrder = new ServiceOrder();
        serviceOrder.setId(30L);
        serviceOrder.setStatus(ServiceOrderStatus.COMPLETED_WITH_RESULT);
        var medicalService = new vn.project.ClinicSystem.model.MedicalService();
        medicalService.setId(40L);
        medicalService.setName("Xét nghiệm máu");
        medicalService.setBasePrice(200_000L);
        serviceOrder.setMedicalService(medicalService);

        PrescriptionItem prescriptionItem = new PrescriptionItem();
        prescriptionItem.setId(50L);
        prescriptionItem.setMedicationName("Ferrovit");
        prescriptionItem.setDosage("1 viên");
        prescriptionItem.setQuantity(10);
        prescriptionItem.setUnitPriceSnapshot(new BigDecimal("5000"));
        prescriptionItem.setAmount(new BigDecimal("50000"));

        Prescription prescription = new Prescription();
        prescription.setItems(List.of(prescriptionItem));

        when(billingRepository.findByVisitId(2L)).thenReturn(Optional.empty());
        when(patientVisitRepository.findById(2L)).thenReturn(Optional.of(visit));
        when(serviceOrderRepository.findByVisitId(2L)).thenReturn(List.of(serviceOrder));
        when(prescriptionRepository.findByVisitIdOrderByIssuedAtDesc(2L)).thenReturn(List.of(prescription));
        when(billingRepository.save(any(Billing.class)))
                .thenAnswer(invocation -> invocation.getArgument(0, Billing.class));

        Billing billing = billingService.generateForVisit(2L);

        assertThat(billing.getItems()).hasSize(2);
        assertThat(billing.getServiceTotal()).isEqualByComparingTo("200000");
        assertThat(billing.getMedicationTotal()).isEqualByComparingTo("50000");
        assertThat(billing.getOtherTotal()).isEqualByComparingTo("0");
        assertThat(billing.getTotalAmount()).isEqualByComparingTo("250000");

        var serviceItem = billing.getItems().stream()
                .filter(i -> i.getItemType() == BillingItemType.SERVICE)
                .findFirst()
                .orElseThrow();
        assertThat(serviceItem.getDescription()).isEqualTo("Xét nghiệm máu");

        var medicationItem = billing.getItems().stream()
                .filter(i -> i.getItemType() == BillingItemType.MEDICATION)
                .findFirst()
                .orElseThrow();
        assertThat(medicationItem.getQuantity()).isEqualTo(10);
        assertThat(medicationItem.getAmount()).isEqualByComparingTo("50000");

        verify(billingRepository).save(any(Billing.class));
        verify(patientVisitRepository).findById(2L);
    }
}
