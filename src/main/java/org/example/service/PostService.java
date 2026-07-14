package org.example.service;

import org.example.dto.CommentResponseDto;
import org.example.dto.PostDetailDto;
import org.example.dto.PostResponseDto;
import org.example.repository.CommentRepository;
import org.example.repository.PostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final MarkdownService markdownService;

    public PostService(
            PostRepository postRepository,
            CommentRepository commentRepository,
            MarkdownService markdownService
    ) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.markdownService = markdownService;
    }

    public Page<PostResponseDto> getPosts(int page, int size, String currentUserLogin) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<PostResponseDto> posts = postRepository.findAllPosts(pageable);

        posts.getContent().forEach(
                post -> {
                    boolean liked = postRepository.hasUserLiked(post.getId(), currentUserLogin);
                    post.setLikedByCurrentUser(liked);

                    if (Boolean.TRUE.equals(post.getUseMarkdown())) {
                        post.setHtmlContent(markdownService.renderMarkdown(post.getText()));
                    } else {
                        post.setHtmlContent(escapeHtml(post.getText()));
                    }
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

                    if (Boolean.TRUE.equals(post.getUseMarkdown())) {
                        post.setHtmlContent(markdownService.renderMarkdown(post.getText()));
                    } else {
                        post.setHtmlContent(escapeHtml(post.getText()));
                    }
                });

        return posts;
    }

    public PostDetailDto getPostDetail(Long postId, String currentUserLogin) {

        PostDetailDto post = postRepository.findPostDetailById(postId)
                .orElseThrow(
                        () -> new IllegalArgumentException("Пост не найден")
                );

        boolean liked = postRepository.hasUserLiked(postId, currentUserLogin);
        post.setLikedByCurrentUser(liked);
        post.setIsAuthor(post.getAuthorLogin().equals(currentUserLogin));

        Pageable pageable = PageRequest.of(0, 20, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<CommentResponseDto> commentsPage = commentRepository.findCommentsByPostIdPaged(postId, pageable);

        if (Boolean.TRUE.equals(post.getUseMarkdown())) {
            post.setHtmlContent(markdownService.renderMarkdown(post.getText()));
        } else {
            post.setHtmlContent(escapeHtml(post.getText()));
        }

        List<CommentResponseDto> comments = commentsPage.getContent();
        post.setComments(comments);

        return post;
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;")
                .replace("\n", "<br>");
    }

}
