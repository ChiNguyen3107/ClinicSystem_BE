package vn.project.ClinicSystem.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories(basePackages = "vn.project.ClinicSystem.repository")
@EnableTransactionManagement
public class DatabaseIndexConfig {
    // Database indexes sẽ được tạo thông qua @Index annotations trong entities
}
