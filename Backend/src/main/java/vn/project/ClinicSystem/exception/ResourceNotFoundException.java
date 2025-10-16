package vn.project.ClinicSystem.exception;

/**
 * Custom exception cho trường hợp không tìm thấy resource
 */
public class ResourceNotFoundException extends RuntimeException {
    private final String resourceType;
    private final String resourceId;

    public ResourceNotFoundException(String message) {
        super(message);
        this.resourceType = null;
        this.resourceId = null;
    }

    public ResourceNotFoundException(String resourceType, String resourceId) {
        super(String.format("%s với ID '%s' không tồn tại", resourceType, resourceId));
        this.resourceType = resourceType;
        this.resourceId = resourceId;
    }

    public ResourceNotFoundException(String resourceType, Long resourceId) {
        super(String.format("%s với ID '%d' không tồn tại", resourceType, resourceId));
        this.resourceType = resourceType;
        this.resourceId = String.valueOf(resourceId);
    }

    public String getResourceType() {
        return resourceType;
    }

    public String getResourceId() {
        return resourceId;
    }
}
