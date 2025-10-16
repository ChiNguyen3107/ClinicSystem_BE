package vn.project.ClinicSystem.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.media.IntegerSchema;
import io.swagger.v3.oas.models.media.StringSchema;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.port:8080}")
    private String serverPort;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Clinic System API")
                        .description("API Documentation cho hệ thống quản lý phòng khám với các tính năng tích hợp AI")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Clinic System Team")
                                .email("support@clinicsystem.com")
                                .url("https://clinicsystem.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:" + serverPort)
                                .description("Development Server"),
                        new Server()
                                .url("https://api.clinicsystem.com")
                                .description("Production Server")
                ))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("JWT Authentication Token"))
                        .addSecuritySchemes("basicAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("basic")
                                .description("Basic Authentication"))
                        .addParameters("pageParam", new Parameter()
                                .in("query")
                                .name("page")
                                .description("Số trang (bắt đầu từ 0)")
                                .required(false)
                                .schema(new IntegerSchema()._default(0)))
                        .addParameters("sizeParam", new Parameter()
                                .in("query")
                                .name("size")
                                .description("Số lượng items per page")
                                .required(false)
                                .schema(new IntegerSchema()._default(20)))
                        .addParameters("sortParam", new Parameter()
                                .in("query")
                                .name("sort")
                                .description("Trường để sắp xếp (ví dụ: name,asc)")
                                .required(false)
                                .schema(new StringSchema())))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }
}
