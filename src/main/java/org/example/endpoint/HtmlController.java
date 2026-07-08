package org.example.endpoint;

import org.example.entity.User;
import org.example.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class HtmlController {
    private static final Logger log = LoggerFactory.getLogger(HtmlController.class);

    private final UserRepository userRepository;

    public HtmlController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/home")
    public String toHome(
            Model model,
            Authentication authentication
    ) {
        String login = authentication.getName();
        userRepository.findByLogin(login).ifPresent(
                user -> {
                    model.addAttribute("userLogin", login);
                    model.addAttribute("userName", user.getName());

                }
        );


        return "home";
    }

    @GetMapping("/")
    public String defaultPage() {
        return "login";
    }
}
