package org.example.repository;

import org.example.entity.Post;
import org.example.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    Optional<Post> findByAuthor(User author);
    Optional<Post> findByAuthorId(Long authorId);

    List<Post> findByTextContainingIgnoreCase(String textPart);
    List<Post> findByTextContainingIgnoreCaseOrderByCreatedAtDesc(String textPart);

    List<Post> findByAuthorIdOrderByCreatedAtDesc(Long authorId);

    List<Post> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
