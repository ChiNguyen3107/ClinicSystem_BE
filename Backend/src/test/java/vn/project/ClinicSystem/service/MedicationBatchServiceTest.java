package vn.project.ClinicSystem.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import vn.project.ClinicSystem.model.Medication;
import vn.project.ClinicSystem.model.MedicationBatch;
import vn.project.ClinicSystem.model.dto.MedicationBatchAdjustRequest;
import vn.project.ClinicSystem.model.dto.MedicationBatchCreateRequest;
import vn.project.ClinicSystem.repository.MedicationBatchRepository;
import vn.project.ClinicSystem.repository.MedicationRepository;

@ExtendWith(MockitoExtension.class)
class MedicationBatchServiceTest {

    @Mock
    private MedicationBatchRepository medicationBatchRepository;

    @Mock
    private MedicationRepository medicationRepository;

    @InjectMocks
    private MedicationBatchService medicationBatchService;

    private Medication medication;

    @BeforeEach
    void setUp() {
        medication = new Medication();
        medication.setId(1L);
        medication.setName("Ferrovit");
        medication.setStockQuantity(10);
    }

    @Test
    void create_shouldCalculateTotalUnitsAndIncreaseMedicationStock() {
        MedicationBatchCreateRequest request = new MedicationBatchCreateRequest();
        request.setMedicationId(1L);
        request.setBatchCode("FER-2401");
        request.setUnitPrice(new BigDecimal("5200"));
        request.setPackageCount(5);
        request.setUnitsPerPackage(20);
        request.setTotalUnits(null); // để service tự tính

        when(medicationRepository.findById(1L)).thenReturn(Optional.of(medication));
        when(medicationBatchRepository.save(any(MedicationBatch.class)))
                .thenAnswer(invocation -> invocation.getArgument(0, MedicationBatch.class));

        MedicationBatch batch = medicationBatchService.create(request);

        assertThat(batch.getQuantityOnHand()).isEqualTo(100); // 5 * 20
        assertThat(batch.getPackageCount()).isEqualTo(5);
        assertThat(batch.getUnitsPerPackage()).isEqualTo(20);
        assertThat(batch.getUnitPrice()).isEqualByComparingTo("5200.00");

        assertThat(medication.getStockQuantity()).isEqualTo(110); // 10 + 100

        verify(medicationBatchRepository).save(any(MedicationBatch.class));
        verify(medicationRepository).save(medication);
    }

    @Test
    void update_shouldAdjustTotalsAndMedicationStock_WhenTotalUnitsChanged() {
        MedicationBatch existingBatch = new MedicationBatch();
        existingBatch.setId(5L);
        existingBatch.setMedication(medication);
        existingBatch.setQuantityOnHand(50);
        existingBatch.setPackageCount(5);
        existingBatch.setUnitsPerPackage(10);

        MedicationBatchAdjustRequest request = new MedicationBatchAdjustRequest();
        request.setPackageCount(4);
        request.setUnitsPerPackage(15);
        request.setTotalUnits(null); // => service sẽ tính 4*15 = 60

        when(medicationBatchRepository.findById(5L)).thenReturn(Optional.of(existingBatch));
        when(medicationBatchRepository.save(any(MedicationBatch.class)))
                .thenAnswer(invocation -> invocation.getArgument(0, MedicationBatch.class));

        MedicationBatch updated = medicationBatchService.update(5L, request);

        assertThat(updated.getQuantityOnHand()).isEqualTo(60);
        assertThat(updated.getPackageCount()).isEqualTo(4);
        assertThat(updated.getUnitsPerPackage()).isEqualTo(15);

        // stock ban đầu 10, batch cũ 50 -> sau update tăng thêm +10 (60-50)
        assertThat(medication.getStockQuantity()).isEqualTo(20);

        verify(medicationRepository).save(medication);
    }
}
