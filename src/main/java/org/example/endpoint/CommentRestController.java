package org.example.endpoint;

import org.example.dto.CommentResponseDto;
import org.example.dto.PostResponseDto;
import org.example.repository.CommentRepository;
import org.example.service.CommentService;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentRestController {

    private final CommentService commentService;
    private final CommentRepository commentRepository;

    public CommentRestController(CommentService commentService, CommentRepository commentRepository) {
        this.commentService = commentService;
        this.commentRepository = commentRepository;
    }

    @GetMapping
    public Map<String, Object> getComments(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        String currentUserLogin = authentication.getName();

        Page< CommentResponseDto> comments = commentService.getComments(page, size, currentUserLogin);

        comments.getContent().forEach(
                comment -> {
                    boolean liked = commentRepository.hasUserLiked(comment.getId(), currentUserLogin);
                    comment.setLikedByCurrentUser(liked);
                }
        );

        Map<String, Object> response = new HashMap<>();
        response.put("comments", comments.getContent());
        response.put("currentPage", comments.getNumber());
        response.put("totalPage", comments.getTotalPages());
        response.put("totalItem", comments.getTotalElements());
        response.put("hasNext", comments.hasNext());
        response.put("hasPrevious", comments.hasPrevious());
        response.put("pageSize", comments.getSize());

        return response;
    }

    @GetMapping("/post/{postId}")
    public Map<String, Object> getPostComments(
            Authentication authentication,
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        String currentUserLogin = authentication.getName();

        Page<CommentResponseDto> comments = commentService.getPostComments(postId, page, size);

        comments.getContent().forEach(
                comment -> {
                    boolean liked = commentRepository.hasUserLiked(comment.getId(), currentUserLogin);
                    comment.setLikedByCurrentUser(liked);
                }
        );

        Map<String, Object> response = new HashMap<>();
        response.put("comments", comments.getContent());
        response.put("currentPage", comments.getNumber());
        response.put("totalPage", comments.getTotalPages());
        response.put("totalItem", comments.getTotalElements());
        response.put("hasNext", comments.hasNext());
        response.put("hasPrevious", comments.hasPrevious());
        response.put("pageSize", comments.getSize());

        return response;
    }
}
