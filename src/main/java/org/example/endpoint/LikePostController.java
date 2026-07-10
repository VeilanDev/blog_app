package org.example.endpoint;

import org.example.entity.Post;
import org.example.entity.User;
import org.example.repository.PostRepository;
import org.example.repository.UserRepository;
import org.example.service.LikePostService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class LikePostController {

    private final LikePostService likePostService;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public LikePostController(
            LikePostService likePostService,
            UserRepository userRepository,
            PostRepository postRepository) {
        this.likePostService = likePostService;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    @PostMapping("/posts/{id}/like")
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
            Post post = postRepository.findById(id)
                    .orElseThrow(
                            () -> new IllegalArgumentException("Пости не найден")
                    );

            boolean hasLiked = likePostService.hasUserLiked(id, user);

            if (hasLiked) {
                likePostService.unlikePost(id, user);
                // System.out.println("с поста с id " + id + " убрали лайк. Всего лайков: " + post.getLikes());
                response.put("action", "unliked");
            } else {
                likePostService.likePost(id, user);
                // System.out.println("на пост с id " + id + " поставлен лайк. Всего лайков: " + post.getLikes());
                response.put("action", "liked");
            }

            response.put("success", true);
            response.put("likesCount", post.getLikes());
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }

        return response;
    }

}
