package vn.project.ClinicSystem.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import vn.project.ClinicSystem.model.User;
import vn.project.ClinicSystem.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final Validator validator;

    public UserService(UserRepository userRepository, Validator validator) {
        this.userRepository = userRepository;
        this.validator = validator;
    }

    public User handleCreateUser(User user) {
        validateBean(user);
        ensureEmailUnique(user.getEmail(), null);
        return userRepository.save(user);
    }

    public List<User> fetchGetAllUsers(Pageable pageable) {
        Page<User> pageUser = userRepository.findAll(pageable);
        return pageUser.getContent();
    }

    public void handleDeleteUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với id: " + id));
        userRepository.delete(user);
    }

    public User handleUpdateUserById(Long id, User changes) {
        User currentUser = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với id: " + id));

        if (changes.getFullName() != null) {
            currentUser.setFullName(changes.getFullName());
        }
        if (changes.getPhone() != null) {
            currentUser.setPhone(changes.getPhone());
        }
        if (changes.getGender() != null) {
            currentUser.setGender(changes.getGender());
        }
        if (changes.getDateOfBirth() != null) {
            currentUser.setDateOfBirth(changes.getDateOfBirth());
        }
        if (changes.getEmail() != null && !changes.getEmail().equalsIgnoreCase(currentUser.getEmail())) {
            ensureEmailUnique(changes.getEmail(), currentUser.getId());
            currentUser.setEmail(changes.getEmail());
        }
        if (changes.getPassword() != null && !changes.getPassword().isBlank()) {
            currentUser.setPassword(changes.getPassword());
        }

        validateBean(currentUser);
        return userRepository.save(currentUser);
    }

    public User handleGetUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User handleGetUserByUsername(String username) {
        return userRepository.findByEmail(username).orElse(null);
    }

    private void validateBean(User user) {
        var violations = validator.validate(user);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }
    }

    private void ensureEmailUnique(String email, Long currentUserId) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email không được để trống");
        }
        userRepository.findByEmail(email.trim()).ifPresent(existing -> {
            if (currentUserId == null || !existing.getId().equals(currentUserId)) {
                throw new EntityExistsException("Email đã tồn tại: " + email);
            }
        });
    }
}