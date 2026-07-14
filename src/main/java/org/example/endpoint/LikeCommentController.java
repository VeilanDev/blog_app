package org.example.endpoint;

import org.example.entity.Comment;
import org.example.entity.User;
import org.example.repository.CommentRepository;
import org.example.repository.UserRepository;
import org.example.service.LikesCommentService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class LikeCommentController {

    private final LikesCommentService likesCommentService;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public LikeCommentController(
            LikesCommentService likesCommentService,
            CommentRepository commentRepository,
            UserRepository userRepository
    ) {
        this.commentRepository = commentRepository;
        this.likesCommentService = likesCommentService;
        this.userRepository = userRepository;
    }

    @PostMapping("/comments/{id}/like")
    public Map<String, Object> toggleLike(
            Authentication authentication,
            @PathVariable Long id
    ) {
        Map<String, Object> response = new HashMap<>();

        try {
            User user = userRepository.findByLogin(authentication.getName())
                    .orElseThrow(
                            () -> new IllegalArgumentException("Пользователь не найден")
                    );
            Comment comment = commentRepository.findById(id)
                    .orElseThrow(
                            () -> new IllegalArgumentException("Комментарий не найден")
                    );

            boolean hasLiked = likesCommentService.hasUserLiked(id, user);

            if (hasLiked) {
                likesCommentService.unlikeComment(id, user);
                response.put("action", "unliked");
            } else {
                likesCommentService.likeComment(id, user);
                response.put("action", "liked");
            }

            response.put("success", true);
            response.put("likesCount", comment.getLikes());
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }

        return response;
    }
}
