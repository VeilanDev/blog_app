package org.example.endpoint;

import org.example.repository.UserRepository;
import org.example.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UsersPageController {

    private final UserRepository userRepository;

    public UsersPageController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public String toUsersPage(
            Authentication authentication,
            Model model
    ) {
        String userLogin = authentication.getName();
        userRepository.findByLogin(userLogin).ifPresent(
                user -> {
                    model.addAttribute("userLogin", userLogin);
                    model.addAttribute("userName", user.getName());
                    model.addAttribute("currentUser", user);
                }
        );

        return "usersPage";
    }

}
