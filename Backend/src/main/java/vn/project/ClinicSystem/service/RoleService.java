package vn.project.ClinicSystem.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.constraints.NotBlank;
import vn.project.ClinicSystem.model.Role;
import vn.project.ClinicSystem.model.User;
import vn.project.ClinicSystem.repository.RoleRepository;
import vn.project.ClinicSystem.repository.UserRepository;

@Service
@Transactional
public class RoleService {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    public RoleService(RoleRepository roleRepository, UserRepository userRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }

    public Role createRole(@NotBlank String rawName, String description) {
        String roleName = normalizeName(rawName);
        roleRepository.findByName(roleName).ifPresent(role -> {
            throw new EntityExistsException("Role da ton tai: " + roleName);
        });

        Role role = new Role();
        role.setName(roleName);
        role.setDescription(description);
        return roleRepository.save(role);
    }

    public Role ensureRole(@NotBlank String rawName, String description) {
        String roleName = normalizeName(rawName);
        return roleRepository.findByName(roleName).orElseGet(() -> {
            Role role = new Role();
            role.setName(roleName);
            role.setDescription(description);
            return roleRepository.save(role);
        });
    }

    public void assignRoleToUser(Long userId, @NotBlank String rawRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User khong ton tai: " + userId));

        Role role = roleRepository.findByName(normalizeName(rawRole))
                .orElseThrow(() -> new EntityNotFoundException("Role khong ton tai: " + rawRole));

        if (user.getRoles().add(role)) {
            userRepository.save(user);
        }
    }

    public void revokeRoleFromUser(Long userId, @NotBlank String rawRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User khong ton tai: " + userId));

        roleRepository.findByName(normalizeName(rawRole))
                .ifPresent(role -> {
                    if (user.getRoles().remove(role)) {
                        userRepository.save(user);
                    }
                });
    }

    public Role getRoleByName(@NotBlank String rawName) {
        return roleRepository.findByName(normalizeName(rawName))
                .orElseThrow(() -> new EntityNotFoundException("Role khong ton tai: " + rawName));
    }

    private String normalizeName(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Ten role khong duoc de trong");
        }
        return name.trim().toUpperCase();
    }
}