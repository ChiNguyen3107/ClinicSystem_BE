package vn.project.ClinicSystem.model.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO cho error response format
 */
public class ErrorResponse {
    private int statusCode;
    private String error;
    private String message;
    private List<ErrorDetail> details;
    private String timestamp;
    private String path;

    public ErrorResponse() {
        this.timestamp = LocalDateTime.now().toString();
    }

    public ErrorResponse(int statusCode, String error, String message, String path) {
        this();
        this.statusCode = statusCode;
        this.error = error;
        this.message = message;
        this.path = path;
    }

    public ErrorResponse(int statusCode, String error, String message, List<ErrorDetail> details, String path) {
        this(statusCode, error, message, path);
        this.details = details;
    }

    // Getters and Setters
    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<ErrorDetail> getDetails() {
        return details;
    }

    public void setDetails(List<ErrorDetail> details) {
        this.details = details;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    /**
     * Inner class cho error details
     */
    public static class ErrorDetail {
        private String field;
        private String message;
        private Object rejectedValue;

        public ErrorDetail() {}

        public ErrorDetail(String field, String message) {
            this.field = field;
            this.message = message;
        }

        public ErrorDetail(String field, String message, Object rejectedValue) {
            this.field = field;
            this.message = message;
            this.rejectedValue = rejectedValue;
        }

        public String getField() {
            return field;
        }

        public void setField(String field) {
            this.field = field;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public Object getRejectedValue() {
            return rejectedValue;
        }

        public void setRejectedValue(Object rejectedValue) {
            this.rejectedValue = rejectedValue;
        }
    }
}
