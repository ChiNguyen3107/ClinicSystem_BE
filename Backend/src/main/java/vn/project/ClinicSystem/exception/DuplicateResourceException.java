package vn.project.ClinicSystem.exception;

/**
 * Custom exception cho trường hợp resource bị trùng lặp
 */
public class DuplicateResourceException extends RuntimeException {
    private final String resourceType;
    private final String field;
    private final String value;

    public DuplicateResourceException(String message) {
        super(message);
        this.resourceType = null;
        this.field = null;
        this.value = null;
    }

    public DuplicateResourceException(String resourceType, String field, String value) {
        super(String.format("%s với %s '%s' đã tồn tại", resourceType, field, value));
        this.resourceType = resourceType;
        this.field = field;
        this.value = value;
    }

    public String getResourceType() {
        return resourceType;
    }

    public String getField() {
        return field;
    }

    public String getValue() {
        return value;
    }
}
