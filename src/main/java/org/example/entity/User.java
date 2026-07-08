package org.example.entity;

import jakarta.persistence.*;
import org.example.enumerate.Role;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.crypto.bcrypt.BCrypt;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name", length = 50)
    private String name;

    @Column(name = "_login", nullable = false, unique = true, length = 128)
    private String login;

    @Column(name = "email", nullable = false, unique = true, length = 256)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 256)
    private String passwordHash;

    @Column(name = "role", nullable = false, length = 128)
    private String role;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> posts = new ArrayList<>();

    @Column(name = "user_hash")
    private String userHash;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public User() {}
    public User(String login, String email, String passwordHash) {
        this.name = login;
        this.login = login;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = Role.USER.name();
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getLogin() {
        return login;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getRole() {
        return role;
    }

    public List<Post> getUserPosts() {
        return posts;
    }

    public String getUserHash() {
        return userHash;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setUserHash(String userHash) {
        this.userHash = userHash;
    }

    public void setUserPosts(List<Post> posts) {
        this.posts = posts;
    }
}
