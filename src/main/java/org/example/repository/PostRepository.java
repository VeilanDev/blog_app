package org.example.repository;

import org.example.dto.PostDetailDto;
import org.example.dto.PostResponseDto;
import org.example.entity.Post;
import org.example.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    Optional<Post> findByAuthor(User author);
    Optional<Post> findByAuthorId(Long authorId);

    List<Post> findByTextContainingIgnoreCase(String textPart);
    List<Post> findByTextContainingIgnoreCaseOrderByCreatedAtDesc(String textPart);

    List<Post> findByAuthorIdOrderByCreatedAtDesc(Long authorId);

    List<Post> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);


    // получение постов с пагинацией
    @Query(
            "SELECT new org.example.dto.PostResponseDto( " +
                    "p.id, p.text, p.imagePath, " +
                    "u.name, u.login, " +
                    "p.createdAt, p.updatedAt, " +
                    "p.redacted, " +
                    "SIZE(p.likesList)," +
                    "SIZE(p.commentsList)) " +
                    "FROM Post p " +
                    "JOIN p.author u " +
                    "ORDER BY p.createdAt DESC"
    )
    Page<PostResponseDto> findAllPosts(Pageable pageable);

    // получения постов пользователя с пагинацией
    @Query(
            "SELECT new org.example.dto.PostResponseDto( " +
                    "p.id, p.text, p.imagePath, " +
                    "u.name, u.login, " +
                    "p.createdAt, p.updatedAt, " +
                    "p.redacted, " +
                    "SIZE(p.likesList), " +
                    "SIZE(p.commentsList))" +
                    "FROM Post p " +
                    "JOIN p.author u " +
                    "WHERE u.id = :userId " +
                    "ORDER BY p.createdAt DESC"
    )
    Page<PostResponseDto> findPostsByAuthorId(@Param("userId") Long userId, Pageable pageable);

    // проверка, поставил ли пользователь лайк на пост
    @Query("SELECT COUNT(lp) > 0 FROM LikesPost lp WHERE lp.post.id = :postId AND lp.user.login = :login")
    Boolean hasUserLiked(@Param("postId") Long postId, @Param("login") String login);

    @Query(
            "SELECT new org.example.dto.PostDetailDto( " +
                    "p.id, p.text, p.imagePath, " +
                    "u.name, u.login, " +
                    "p.createdAt, p.updatedAt, " +
                    "p.redacted, " +
                    "SIZE(p.likesList), " +
                    "SIZE(p.commentsList)) " +
                    "FROM Post p " +
                    "JOIN p.author u " +
                    "WHERE p.id = :postId"
    )
    Optional<PostDetailDto> findPostDetailById(@Param("postId") Long postId);
}
