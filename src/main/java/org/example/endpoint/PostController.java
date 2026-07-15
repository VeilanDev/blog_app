package org.example.endpoint;

import org.example.entity.Post;
import org.example.repository.PostRepository;
import org.example.repository.UserRepository;
import org.example.service.FileStorageService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class PostController {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final FileStorageService fileStorageService;

    PostController(
            PostRepository postRepository,
            UserRepository userRepository,
            FileStorageService fileStorageService
    ) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/posts/create")
    public String createPost(
            Authentication authentication,
            @ModelAttribute Post post,
            @RequestParam(value = "useMarkdown", required = false) Boolean useMarkdown,
            @RequestParam(value = "image", required = false)MultipartFile image
            ) {
        String login = authentication.getName();
        userRepository.findByLogin(login).ifPresent(
                user ->
                        post.setAuthor(user)
        );
        post.setUseMarkdown(useMarkdown != null && useMarkdown);

        if (image != null && !image.isEmpty()) {
            try {
                String imageUrl = fileStorageService.uploadFile(image, "posts");
                post.setImageUrl(imageUrl);
            } catch (Exception e) {
                System.err.println("Failed to upload image: " + e.getMessage());
            }
        }

        postRepository.save(post);

        return "redirect:/home/" + login;
    }

    @PostMapping("/posts/{id}/update")
    public String updatePost(
            Authentication authentication,
            RedirectAttributes redirectAttributes,
            @PathVariable Long id,
            @RequestParam String text
    ) {
        Post post = postRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Пост не найден")
        );

        if (!post.getAuthor().getLogin().equals(authentication.getName())) {
            redirectAttributes.addFlashAttribute("error", "У вас нету прав на редактирование");
            return "redirect:/home/" + authentication.getName();
        }

        if (post.getText().equals(text)) {
            return "redirect:/home/" + authentication.getName();
        }

        post.setText(text);
        post.setRedacted(true);
        postRepository.save(post);

        redirectAttributes.addFlashAttribute("success", "Пост успешно обновлен");
        return "redirect:/home/" + authentication.getName();
    }

    @PostMapping("/posts/{id}/delete")
    public String deletePost(
            Authentication authentication,
            RedirectAttributes redirectAttributes,
            @PathVariable Long id
    ) {
        Post post = postRepository.findById(id)
                .orElseThrow(
                        () -> new IllegalArgumentException("Пост не найден")
                );

        if (!post.getAuthor().getLogin().equals(authentication.getName())) {
            redirectAttributes.addFlashAttribute("error", "У вас нет прав на удаление");
            System.out.println(
                    "У вас " + authentication.getName() + " | автор : " + post.getAuthor().getLogin() +
                            " нет прав удалить пост. id " + post.getId()
            );
            return "redirect:/home/" + authentication.getName();
        }

        if (post.getImageUrl() != null && !post.getImageUrl().isEmpty()) {
            try {
                fileStorageService.deleteFile(post.getImageUrl());
            } catch (Exception e) {
                System.err.println("Failed to delete image: " + e.getMessage());
            }
        }

        postRepository.delete(post);
        redirectAttributes.addFlashAttribute("success", "Пост успешно удален");

        return "redirect:/home/" + authentication.getName();
    }
}
