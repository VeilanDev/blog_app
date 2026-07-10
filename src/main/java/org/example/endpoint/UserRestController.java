package org.example.endpoint;

import org.example.dto.UserResponseDto;
import org.example.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserRestController {

    private final UserService userService;

    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public Map<String, Object> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "30") int size
    ) {
        Page<UserResponseDto> users = userService.getUsers(page, size);

        Map<String, Object> response = new HashMap<>();
        response.put("users", users.getContent());
        response.put("currentPage", users.getNumber());
        response.put("totalPage", users.getTotalPages());
        response.put("totalItem", users.getTotalElements());
        response.put("hasNext", users.hasNext());
        response.put("hasPrevious", users.hasPrevious());
        response.put("pageSize", users.getSize());

        return response;
    }
}
