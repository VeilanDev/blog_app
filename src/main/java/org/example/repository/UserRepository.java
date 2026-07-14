package org.example.repository;

import org.example.dto.UserResponseDto;
import org.example.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByLogin(String login);
    Optional<User> findByEmail(String email);

    List<User> findByNameContainingIgnoreCase(String namePart);
    List<User> findByNameContainingIgnoreCaseOrderByNameAsc(String namePart);
    List<User> findByNameStartingWith(String namePart);

    @Query("SELECT new org.example.dto.UserResponseDto(u.id, u.login, u.name, u.email) FROM User u ORDER BY u.id")
    Page<UserResponseDto> findAllUsers(Pageable pageable);

    @Query(
            "SELECT new org.example.dto.UserResponseDto(u.id, u.login, u.name, u.email) " +
                    "FROM User u " +
                    "WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
                    "OR LOWER(u.login) LIKE LOWER(CONCAT('%', :query, '%')) " +
                    "ORDER BY u.id "
    )
    Page<UserResponseDto> searchUsers(@Param("query") String query, Pageable pageable);

    @Query(
            "SELECT new org.example.dto.UserResponseDto(u.id, u.login, u.name, u.email) " +
                    "FROM User u " +
                    "WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%')) " +
                    "ORDER BY u.id "
    )
    Page<UserResponseDto> searchByName(@Param("name") String name, Pageable pageable);

    @Query(
            "SELECT new org.example.dto.UserResponseDto(u.id, u.login, u.name, u.email) " +
                    "FROM User u " +
                    "WHERE LOWER(u.login) LIKE LOWER(CONCAT('%', :login, '%')) " +
                    "ORDER BY u.id "
    )
    Page<UserResponseDto> searchByLogin(@Param("login") String login, Pageable pageable);
}
