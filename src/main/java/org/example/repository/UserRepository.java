package org.example.repository;

import org.example.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByLogin(String login);
    Optional<User> findByEmail(String email);

    List<User> findByNameContainingIgnoreCase(String namePart);
    List<User> findByNameContainingIgnoreCaseOrderByNameAsc(String namePart);
    List<User> findByNameStartingWith(String namePart);
}
