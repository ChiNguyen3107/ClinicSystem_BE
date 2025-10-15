package vn.project.ClinicSystem.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.project.ClinicSystem.model.ServiceOrder;
import vn.project.ClinicSystem.model.enums.ServiceOrderStatus;

@Repository
public interface ServiceOrderRepository extends JpaRepository<ServiceOrder, Long> {
    List<ServiceOrder> findByVisitId(Long visitId);

    List<ServiceOrder> findByVisitIdAndStatus(Long visitId, ServiceOrderStatus status);
}
