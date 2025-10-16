package vn.project.ClinicSystem.service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.project.ClinicSystem.model.Doctor;
import vn.project.ClinicSystem.model.Patient;
import vn.project.ClinicSystem.repository.DoctorRepository;
import vn.project.ClinicSystem.repository.PatientRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class BatchService {
    
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    @Transactional
    public List<Doctor> batchCreateDoctors(List<Doctor> doctors) {
        log.info("Bắt đầu batch create {} doctors", doctors.size());
        List<Doctor> savedDoctors = doctorRepository.saveAll(doctors);
        log.info("Hoàn thành batch create {} doctors", savedDoctors.size());
        return savedDoctors;
    }

    @Transactional
    public List<Patient> batchCreatePatients(List<Patient> patients) {
        log.info("Bắt đầu batch create {} patients", patients.size());
        List<Patient> savedPatients = patientRepository.saveAll(patients);
        log.info("Hoàn thành batch create {} patients", savedPatients.size());
        return savedPatients;
    }

    @Async
    public CompletableFuture<Void> asyncBatchUpdateDoctors(List<Doctor> doctors) {
        log.info("Bắt đầu async batch update {} doctors", doctors.size());
        try {
            doctorRepository.saveAll(doctors);
            log.info("Hoàn thành async batch update {} doctors", doctors.size());
        } catch (Exception e) {
            log.error("Lỗi trong async batch update doctors", e);
            throw e;
        }
        return CompletableFuture.completedFuture(null);
    }

    @Async
    public CompletableFuture<Void> asyncBatchUpdatePatients(List<Patient> patients) {
        log.info("Bắt đầu async batch update {} patients", patients.size());
        try {
            patientRepository.saveAll(patients);
            log.info("Hoàn thành async batch update {} patients", patients.size());
        } catch (Exception e) {
            log.error("Lỗi trong async batch update patients", e);
            throw e;
        }
        return CompletableFuture.completedFuture(null);
    }

    @Transactional
    public void bulkDeleteDoctors(List<Long> doctorIds) {
        log.info("Bắt đầu bulk delete {} doctors", doctorIds.size());
        doctorRepository.deleteAllById(doctorIds);
        log.info("Hoàn thành bulk delete {} doctors", doctorIds.size());
    }

    @Transactional
    public void bulkDeletePatients(List<Long> patientIds) {
        log.info("Bắt đầu bulk delete {} patients", patientIds.size());
        patientRepository.deleteAllById(patientIds);
        log.info("Hoàn thành bulk delete {} patients", patientIds.size());
    }
}
