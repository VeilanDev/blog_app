package org.example.endpoint;

import org.example.dto.PostDetailDto;
import org.example.dto.PostResponseDto;
import org.example.service.PostService;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostRestController {

    private final PostService postService;

    public PostRestController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public Map<String, Object> getPosts(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        String currentUserLogin = authentication.getName();

        Page<PostResponseDto> posts = postService.getPosts(page, size, currentUserLogin);

        Map<String, Object> response = new HashMap<>();
        response.put("posts", posts.getContent());
        response.put("currentPage", posts.getNumber());
        response.put("totalPage", posts.getTotalPages());
        response.put("totalItem", posts.getTotalElements());
        response.put("hasNext", posts.hasNext());
        response.put("hasPrevious", posts.hasPrevious());
        response.put("pageSize", posts.getSize());

        return response;
    }

    @GetMapping("/user/{userId}")
    public Map<String, Object> getUserPosts(
            Authentication authentication,
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        String currentUserLogin = authentication.getName();

        Page<PostResponseDto> posts = postService.getUserPosts(userId, page, size, currentUserLogin);

        Map<String, Object> response = new HashMap<>();
        response.put("posts", posts.getContent());
        response.put("currentPage", posts.getNumber());
        response.put("totalPage", posts.getTotalPages());
        response.put("totalItem", posts.getTotalElements());
        response.put("hasNext", posts.hasNext());
        response.put("hasPrevious", posts.hasPrevious());
        response.put("pageSize", posts.getSize());

        return response;
    }

    @GetMapping("/{id}/detail")
    public PostDetailDto getPostDetail(
            Authentication authentication,
            @PathVariable Long id
    ) {
        String currentUserLogin = authentication.getName();
        return postService.getPostDetail(id, currentUserLogin);
    }
}
