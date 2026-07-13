package org.example.endpoint;

import org.apache.catalina.users.SparseUserDatabase;
import org.example.entity.Comment;
import org.example.entity.Post;
import org.example.entity.User;
import org.example.repository.CommentRepository;
import org.example.repository.PostRepository;
import org.example.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class CommentController {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public CommentController(
            CommentRepository commentRepository,
            PostRepository postRepository,
            UserRepository userRepository
    ) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/comments/create")
    public String createComment(
            Authentication authentication,
            RedirectAttributes redirectAttributes,
            @RequestParam Long postId,
            @RequestParam String text
    ) {
        String userLogin = authentication.getName();;

        User author = userRepository.findByLogin(userLogin)
                .orElseThrow(
                        () -> new IllegalArgumentException("Пользователь не найден")
                );
        Post post = postRepository.findById(postId)
                .orElseThrow(
                        () -> new IllegalArgumentException("Пост не найден")
                );

        if (text == null || text.trim().isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "Текст комментария не может быть пустым");
            return "redirect:/home/" + userLogin;
        }

        Comment comment = new Comment(post, author, text.trim());
        commentRepository.save(comment);

        redirectAttributes.addFlashAttribute("success", "Комментарий успешно добавлен");

        return "redirect:/home/" + userLogin;
    }

    @PostMapping("/comments/{id}/update")
    public String updateComment(
            Authentication authentication,
            RedirectAttributes redirectAttributes,
            @PathVariable Long id,
            @RequestParam String text
    ) {
        String userLogin = authentication.getName();

        Comment comment = commentRepository.findById(id)
                .orElseThrow(
                        () -> new IllegalArgumentException("Комментарий не найден")
                );

        if (!comment.getAuthor().getLogin().equals(userLogin)) {
            redirectAttributes.addFlashAttribute("error", "У вас нет прав на редактирование этого комментария");
            return "redirect:/home/" + userLogin;
        }

        if (text == null || text.trim().isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "Текст комментария не может быть пустым");
            return "redirect:/home/" + userLogin;
        }

        if (comment.getText().equals(text.trim())) {
            redirectAttributes.addFlashAttribute("info", "Текст комментария не изменился");
            return "redirect:/home/" + userLogin;
        }

        comment.setText(text.trim());
        comment.setRedacted(true);
        commentRepository.save(comment);

        redirectAttributes.addFlashAttribute("success", "Комментарий успешно обновлен");

        return "redirect:/home/" + userLogin;
    }

    @PostMapping("/comments/{id}/delete")
    public String deleteComment(
            Authentication authentication,
            RedirectAttributes redirectAttributes,
            @PathVariable Long id
    ) {

        String userLogin = authentication.getName();

        Comment comment = commentRepository.findById(id)
                .orElseThrow(
                        () -> new IllegalArgumentException("Комментарий не найден")
                );

        if (!comment.getAuthor().getLogin().equals(userLogin)) {
            redirectAttributes.addFlashAttribute("error", "У вас нет прав на удаление этого комментария");
            return "redirect:/home/" + userLogin;
        }

        commentRepository.delete(comment);

        redirectAttributes.addFlashAttribute("seccess", "Комментарий успешно удален");
        return "redirect:/home/" + userLogin;
    }

}
