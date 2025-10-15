package vn.project.ClinicSystem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.project.ClinicSystem.model.ServiceOrderResult;

@Repository
public interface ServiceOrderResultRepository extends JpaRepository<ServiceOrderResult, Long> {

    List<ServiceOrderResult> findByServiceOrderIdOrderByIdAsc(Long serviceOrderId);

    void deleteByServiceOrderId(Long serviceOrderId);
}
