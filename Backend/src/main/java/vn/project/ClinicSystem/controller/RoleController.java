package vn.project.ClinicSystem.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.project.ClinicSystem.model.Role;
import vn.project.ClinicSystem.model.dto.RoleAssignmentRequest;
import vn.project.ClinicSystem.model.dto.RoleRequest;
import vn.project.ClinicSystem.service.RoleService;

@RestController
@RequestMapping("/roles")
public class RoleController {
    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Role> createRole(@Valid @RequestBody RoleRequest request) {
        Role role = roleService.createRole(request.getName(), request.getDescription());
        return ResponseEntity.status(HttpStatus.CREATED).body(role);
    }

    @PostMapping("/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> assignRole(@Valid @RequestBody RoleAssignmentRequest request) {
        roleService.assignRoleToUser(request.getUserId(), request.getRole());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/revoke")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> revokeRole(@Valid @RequestBody RoleAssignmentRequest request) {
        roleService.revokeRoleFromUser(request.getUserId(), request.getRole());
        return ResponseEntity.ok().build();
    }
}
