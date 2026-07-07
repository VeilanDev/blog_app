package org.example.endpoint;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HtmlController {
    private static final Logger log = LoggerFactory.getLogger(HtmlController.class);

    @GetMapping("/login")
    public String toLogin() {
        return "login";
    }

    @GetMapping("/home")
    public String toHome() {
        return "home";
    }

    @GetMapping("/")
    public String defaultPage() {
        return "login";
    }
}
