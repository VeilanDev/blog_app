package org.example.endpoint;

import org.example.entity.Post;
import org.example.repository.UserRepository;
import org.example.service.LikePostService;
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
    private final LikePostService likePostService;

    public HtmlController(UserRepository userRepository, LikePostService likePostService) {
        this.userRepository = userRepository;
        this.likePostService = likePostService;
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

        return "home";
    }

    @GetMapping("/")
    public String defaultPage() {
        return "home";
    }
}
