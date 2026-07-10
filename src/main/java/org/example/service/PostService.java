package org.example.service;

import org.example.dto.PostResponseDto;
import org.example.repository.PostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public Page<PostResponseDto> getPosts(int page, int size, String currentUserLogin) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<PostResponseDto> posts = postRepository.findAllPosts(pageable);

        posts.getContent().forEach(
                post -> {
                    boolean liked = postRepository.hasUserLiked(post.getId(), currentUserLogin);
                    post.setLikedByCurrentUser(liked);
                });

        return posts;
    }

    public Page<PostResponseDto> getUserPosts(Long userId, int page, int size, String currentUserLogin) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<PostResponseDto> posts = postRepository.findPostsByAuthorId(userId, pageable);

        posts.getContent().forEach(
                post -> {
                    boolean liked = postRepository.hasUserLiked(post.getId(), currentUserLogin);
                    post.setLikedByCurrentUser(liked);
                });

        return posts;
    }


}
