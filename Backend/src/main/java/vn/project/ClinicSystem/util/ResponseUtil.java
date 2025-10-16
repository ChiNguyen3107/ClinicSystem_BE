package vn.project.ClinicSystem.util;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import vn.project.ClinicSystem.model.RestResponse;

public class ResponseUtil {
    
    public static <T> ResponseEntity<RestResponse<T>> success(T data, String message) {
        RestResponse<T> response = new RestResponse<>();
        response.setStatusCode(HttpStatus.OK.value());
        response.setMessage(message);
        response.setData(data);
        return ResponseEntity.ok(response);
    }
    
    public static <T> ResponseEntity<RestResponse<T>> error(String message) {
        RestResponse<T> response = new RestResponse<>();
        response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.setMessage(message);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
    
    public static <T> ResponseEntity<RestResponse<T>> error(String message, HttpStatus status) {
        RestResponse<T> response = new RestResponse<>();
        response.setStatusCode(status.value());
        response.setMessage(message);
        return ResponseEntity.status(status).body(response);
    }
}
