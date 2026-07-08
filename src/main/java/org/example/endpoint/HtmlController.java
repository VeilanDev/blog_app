package org.example.endpoint;

import org.example.entity.Post;
import org.example.repository.PostRepository;
import org.example.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class HtmlController {
    private static final Logger log = LoggerFactory.getLogger(HtmlController.class);

    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public HtmlController(UserRepository userRepository, PostRepository postRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    @GetMapping("/home")
    public String redirectToHome(Authentication authentication) {
        String loginUserPage = authentication.getName();
        return "redirect:/home/" + loginUserPage;
    }

    @GetMapping("/home/{loginUserPage}")
    public String toHome(
            Model model,
            Authentication authentication,
            @PathVariable String loginUserPage
    ) {
        String userLogin = authentication.getName();
        userRepository.findByLogin(userLogin).ifPresent(
                user -> {
                    model.addAttribute("userLogin", userLogin);
                    model.addAttribute("userName", user.getName());
                }
        );
        userRepository.findByLogin(loginUserPage).ifPresent(
                userInPage -> {
                    model.addAttribute("posts", userInPage.getUserPosts());
                }
        );

        model.addAttribute("post", new Post());

        return "home";
    }

    @PostMapping("/posts/create")
    public String createPost(
            Model model,
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

    @GetMapping("/")
    public String defaultPage() {
        return "home";
    }
}
