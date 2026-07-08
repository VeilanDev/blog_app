package org.example.endpoint;

import org.example.entity.User;
import org.example.service.RegistrationService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @GetMapping("/register")
    public String registrationForm() {
        return "/register";
    }

    @PostMapping("/register")
    public String regUser(
            Model model,
            @RequestParam String login,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String confirmPassword
    ) {
        if (!password.equals(confirmPassword)) {
            model.addAttribute("error", "Пароль не совпадает");
            return "register";
        }

        try {
            User userEntity = registrationService.userReg(login, email, password);
            return "redirect:/login?registrered=true";
        } catch (IllegalArgumentException e) {
            model.addAttribute("error", e.getMessage());
            return "register";
        }

    }

    @GetMapping("/login")
    public String toLogin() {
        return "login";
    }
}
