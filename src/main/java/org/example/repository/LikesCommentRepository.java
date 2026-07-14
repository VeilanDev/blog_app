package org.example.repository;

import org.example.entity.Comment;
import org.example.entity.LikesComment;
import org.example.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface LikesCommentRepository extends JpaRepository<LikesComment, Long> {

    boolean existsByCommentAndUser(Comment comment, User user);

    Optional<LikesComment> findByCommentAndUser(Comment comment, User user);

    Integer countByComment(Comment comment);

    @Modifying
    @Transactional
    @Query("DELETE FROM LikesComment l WHERE l.comment = :comment AND l.user = :user")
    void deleteByCommentAndUser(@Param("comment") Comment comment, @Param("user") User user);

}
