package org.example.endpoint;

import org.example.entity.Post;
import org.example.repository.PostRepository;
import org.example.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class PostController {

    private final UserRepository userRepository;
    private final PostRepository postRepository;

    PostController(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/posts/create")
    public String createPost(
            Authentication authentication,
            @ModelAttribute Post post
    ) {
        String login = authentication.getName();
        userRepository.findByLogin(login).ifPresent(
                user ->
                        post.setAuthor(user)
        );
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
        System.out.println("Получен запрос на редактирование поста с id " + post.getId());

        if (!post.getAuthor().getLogin().equals(authentication.getName())) {
            redirectAttributes.addFlashAttribute("error", "У вас нету прав на редактирование");
            System.out.println(
                    "У вас " + authentication.getName() + " | автор : " + post.getAuthor().getLogin() +
                            " нет прав редактировать пост. id " + post.getId()
            );
            return "redirect:/home/" + authentication.getName();
        }

        if (post.getText().equals(text)) {
            System.out.println("Текст поста совпадает с измененным постом. id " + post.getId());
            return "redirect:/home/" + authentication.getName();

        }

        post.setText(text);
        post.setRedacted(true);
        postRepository.save(post);

        redirectAttributes.addFlashAttribute("success", "Пост успешно обновлен");
        System.out.println("Редактирование поста успешно завершено. id " + post.getId());
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

        postRepository.delete(post);
        redirectAttributes.addFlashAttribute("success", "Пост успешно удален");
        System.out.println("Пост с id " + id + " успешно удален");

        return "redirect:/home/" + authentication.getName();
    }
}
