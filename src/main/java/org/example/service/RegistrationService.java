package org.example.service;

import org.example.entity.User;
import org.example.enumerate.Role;
import org.example.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegistrationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public RegistrationService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    @Transactional
    public User userReg(String login, String email, String passwordRaw) {

        if (userRepository.findByLogin(login).isPresent()) {
            throw new IllegalArgumentException("Пользователь с логином " + login + " существует");
        }

        User userEntity = new User();
        userEntity.setLogin(login);
        userEntity.setEmail(email);
        userEntity.setName(login);

        String passwordHash = passwordEncoder.encode(passwordRaw);
        userEntity.setPasswordHash(passwordHash);

        userEntity.setRole(Role.USER.name());

        return userRepository.save(userEntity);
    }
}
