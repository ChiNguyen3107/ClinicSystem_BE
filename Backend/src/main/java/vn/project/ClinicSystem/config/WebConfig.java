package vn.project.ClinicSystem.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web configuration để đăng ký interceptors
 */
@Configuration
@Order(1)
public class WebConfig implements WebMvcConfigurer {
    
    @Autowired
    private LoggingInterceptor loggingInterceptor;
    
    @Autowired
    private RateLimitingInterceptor rateLimitingInterceptor;
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // Rate limiting interceptor - chạy đầu tiên
        registry.addInterceptor(rateLimitingInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns(
                    "/error",
                    "/favicon.ico",
                    "/actuator/**",
                    "/swagger-ui/**",
                    "/v3/api-docs/**"
                );
        
        // Logging interceptor - chạy sau rate limiting
        registry.addInterceptor(loggingInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns(
                    "/error",
                    "/favicon.ico",
                    "/actuator/**",
                    "/swagger-ui/**",
                    "/v3/api-docs/**"
                );
    }
}
