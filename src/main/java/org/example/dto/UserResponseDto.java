package org.example.dto;

public class UserResponseDto {
    private Long id;
    private String login;
    private String name;
    private String email;

    public UserResponseDto() {}
    public UserResponseDto(
            Long id,
            String login,
            String name,
            String email
    ) {
        this.id = id;
        this.login = login;
        this.name = name;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
