package org.example.repository;

import org.example.entity.LikesPost;
import org.example.entity.Post;
import org.example.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface LikesPostRepository extends JpaRepository<LikesPost, Long> {

    boolean existsByPostAndUser(Post post, User user);

    Optional<LikesPost> findByPostAndUser(Post post, User user);

    Integer countByPost(Post post);

    @Modifying
    @Transactional
    @Query("DELETE FROM LikesPost l WHERE l.post = :post AND l.user = :user")
    void deleteByPostAndUser(@Param("post") Post post, @Param("user") User user);
}
