package org.example.config;

import org.example.enumerate.Role;
import org.example.repository.UserRepository;
import org.example.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/login", "/register", "/css/**", "/js/**", "/error/**").permitAll()
                        .requestMatchers("/admin/**").hasRole(Role.ADMIN.name())
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login")
                        .defaultSuccessUrl("/home", true)
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout")
                        .permitAll()
                )
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/login", "/register")
                )
        ;

        return http.build();
    }

//    private final UserRepository userRepository;
//    public SecurityConfig(UserRepository userRepository) {
//        this.userRepository = userRepository;
//    }
//
//    @Bean
//    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
//        String login = "user";
//        String email = "user@user";
//        String passwordRaw = "user";
//        String passwordHash = passwordEncoder.encode(passwordRaw);
//        String role = Role.USER.name();
//
//        UserDetails user = User.builder()
//                .username(login)
//                .password(passwordHash)
//                .roles(role)
//                .build();
//
//        org.example.entity.User entityUser = new org.example.entity.User(login, email, passwordHash);
//        userRepository.save(entityUser);
//
//        return new InMemoryUserDetailsManager(user);
//    }

    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }


    public boolean checkPassword(String passwordRaw, org.example.entity.User userEntity) {
        PasswordEncoder passwordEncoder = passwordEncoder();
        return passwordEncoder.matches(passwordRaw, userEntity.getPasswordHash());
    }

}
