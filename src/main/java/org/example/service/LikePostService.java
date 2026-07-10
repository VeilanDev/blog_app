package org.example.service;

import org.example.entity.LikesPost;
import org.example.entity.Post;
import org.example.entity.User;
import org.example.repository.LikesPostRepository;
import org.example.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LikePostService {

    private final LikesPostRepository likesPostRepository;
    private final PostRepository postRepository;

    public LikePostService(LikesPostRepository likesPostRepository, PostRepository postRepository) {
        this.likesPostRepository = likesPostRepository;
        this.postRepository = postRepository;
    }

    @Transactional
    public void likePost(Long postId, User user) {
        Post post = postExists(postId);

        if (likesPostRepository.existsByPostAndUser(post, user)) {
            throw new IllegalArgumentException("Вы уже поставили лайк");
        }

        LikesPost like = new LikesPost(post, user);
        likesPostRepository.save(like);
    }

    @Transactional
    public void unlikePost(Long postId, User user) {
        Post post = postExists(postId);
        likesPostRepository.deleteByPostAndUser(post, user);
    }

    public boolean hasUserLiked(Long postId, User user) {
        Post post = postExists(postId);
        return likesPostRepository.existsByPostAndUser(post, user);
    }

    public Integer getLikesCount(Long postId) {
        Post post = postExists(postId);
        return likesPostRepository.countByPost(post);
    }

    private Post postExists(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(
                        () -> new IllegalArgumentException("Пост не найден")
                );
        return post;
    }

}
