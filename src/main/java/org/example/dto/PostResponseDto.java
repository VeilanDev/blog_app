package org.example.dto;

import java.time.LocalDateTime;

public class PostResponseDto {
    private Long id;
    private String text;
    private String htmlContent;
    private String imagePath;
    private String authorName;
    private String authorLogin;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean redacted;
    private Boolean useMarkdown;
    private Integer likes;
    private Boolean likedByCurrentUser;
    private Integer comments;

    public PostResponseDto() {}
    public PostResponseDto(
            Long id,
            String text,
            String htmlContent,
            String imagePath,
            String authorName,
            String authorLogin,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            Boolean redacted,
            Boolean useMarkdown,
            Integer likes,
            Integer comments
    ) {
        this.id = id;
        this.text = text;
        this.htmlContent = htmlContent;
        this.imagePath = imagePath;
        this.authorName = authorName;
        this.authorLogin = authorLogin;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.redacted = redacted;
        this.useMarkdown = useMarkdown;
        this.likes = likes;
        this.comments = comments;
        this.likedByCurrentUser = false;
    }
    public PostResponseDto(
            Long id,
            String text,
            String htmlContent,
            String imagePath,
            String authorName,
            String authorLogin,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            Boolean redacted,
            Boolean useMarkdown,
            Integer likes,
            Boolean likedByCurrentUser,
            Integer comments
    ) {
        this.id = id;
        this.text = text;
        this.htmlContent = htmlContent;
        this.imagePath = imagePath;
        this.authorName = authorName;
        this.authorLogin = authorLogin;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.redacted = redacted;
        this.useMarkdown = useMarkdown;
        this.likes = likes;
        this.likedByCurrentUser = likedByCurrentUser;
        this.comments = comments;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getAuthorLogin() {
        return authorLogin;
    }

    public void setAuthorLogin(String authorLogin) {
        this.authorLogin = authorLogin;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Boolean getRedacted() {
        return redacted;
    }

    public void setRedacted(Boolean redacted) {
        this.redacted = redacted;
    }

    public Integer getLikes() {
        return likes;
    }

    public void setLikes(Integer likes) {
        this.likes = likes;
    }

    public Boolean getLikedByCurrentUser() {
        return likedByCurrentUser;
    }

    public void setLikedByCurrentUser(Boolean likedByCurrentUser) {
        this.likedByCurrentUser = likedByCurrentUser;
    }

    public Integer getComments() {
        return comments;
    }

    public void setComments(Integer comments) {
        this.comments = comments;
    }

    public String getHtmlContent() {
        return htmlContent;
    }

    public void setHtmlContent(String htmlContent) {
        this.htmlContent = htmlContent;
    }

    public Boolean getUseMarkdown() {
        return useMarkdown;
    }

    public void setUseMarkdown(Boolean useMarkdown) {
        this.useMarkdown = useMarkdown;
    }
}
