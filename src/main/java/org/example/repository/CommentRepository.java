package org.example.repository;

import org.example.dto.CommentResponseDto;
import org.example.entity.Comment;
import org.example.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    Optional<Comment> findByPost(Post post);
    Optional<Comment> findByAuthorId(Long authorId);

    List<Comment> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
    List<Comment> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query(
            "SELECT new org.example.dto.CommentResponseDto( " +
                    "c.id, p.id, " +
                    "u.name, u.login, " +
                    "c.text, " +
                    "c.createdAt, c.updatedAt, " +
                    "c.redacted) " +
                    "FROM Comment c " +
                    "JOIN c.author u " +
                    "JOIN c.post p " +
                    "ORDER BY c.createdAt DESC"
    )
    Page<CommentResponseDto> findAllComments(Pageable pageable);

    @Query(
            "SELECT new org.example.dto.CommentResponseDto( " +
                    "c.id, p.id, " +
                    "u.name, u.login, " +
                    "c.text, " +
                    "c.createdAt, c.updatedAt, " +
                    "c.redacted ) " +
                    "FROM Comment c " +
                    "JOIN c.author u " +
                    "JOIN c.post p " +
                    "WHERE p.id = :postId " +
                    "ORDER BY c.createdAt DESC"
    )
    List<CommentResponseDto> findCommentsByPostId(@Param("postId") Long postId, Pageable pageable);

    // Для пагинации (если нужно)
    @Query(
            "SELECT new org.example.dto.CommentResponseDto( " +
                    "c.id, p.id, " +
                    "u.name, u.login, " +
                    "c.text, " +
                    "c.createdAt, c.updatedAt, " +
                    "c.redacted) " +
                    "FROM Comment c " +
                    "JOIN c.author u " +
                    "JOIN c.post p " +
                    "WHERE p.id = :postId " +
                    "ORDER BY c.createdAt DESC"
    )
    Page<CommentResponseDto> findCommentsByPostIdPaged(@Param("postId") Long postId, Pageable pageable);

    @Query("SELECT c FROM Comment c WHERE c.id = :id AND c.author.login = :login")
    Optional<Comment> findByIdAndAuthorLogin(@Param("id") Long id, @Param("login") String login);
}
