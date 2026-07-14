package org.example.endpoint;

import org.example.entity.Post;
import org.example.repository.UserRepository;
import org.example.service.LikePostService;
import org.example.service.MarkdownService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class HomePageController {
    private static final Logger log = LoggerFactory.getLogger(HomePageController.class);

    private final UserRepository userRepository;
    private final LikePostService likePostService;
    private final MarkdownService markdownService;

    public HomePageController(
            UserRepository userRepository,
            LikePostService likePostService,
            MarkdownService markdownService
    ) {
        this.userRepository = userRepository;
        this.likePostService = likePostService;
        this.markdownService = markdownService;
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
        userRepository.findByLogin(loginUserPage).ifPresent(
                userPage -> {
                    model.addAttribute("userId", userPage.getId());
                    model.addAttribute("nameUserPage", userPage.getName());
                }
        );
        userRepository.findByLogin(userLogin).ifPresent(
                user -> {
                    model.addAttribute("userLogin", userLogin);
                    model.addAttribute("userName", user.getName());
                    model.addAttribute("currentUser", user);
                }
        );

        model.addAttribute("loginUserPage", loginUserPage);
        model.addAttribute("post", new Post());

        model.addAttribute("markdownService", markdownService);

        return "home";
    }

    @GetMapping("/")
    public String defaultPage() {
        return "home";
    }
}
