package org.example.repository;

import org.example.entity.Usr;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<Usr, Long> {

    Optional<Usr> findByLogin(String login);
    Optional<Usr> findByEmail(String email);

    List<Usr> findByNameContainingIgnoreCase(String namePart);
    List<Usr> findByNameContainingIgnoreCaseOrderByNameAsc(String namePart);
    List<Usr> findByNameStartingWith(String namePart);
}
