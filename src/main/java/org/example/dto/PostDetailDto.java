package org.example.dto;

import java.time.LocalDateTime;

public class PostDetailDto {
    private Long id;
    private String text;
    private String imagePath;
    private String authorName;
    private String authorLogin;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean redacted;
    private Integer likes;
    private Boolean likedByCurrentUser;
    private Boolean isAuthor;

    public PostDetailDto() {}

    public PostDetailDto(
            Long id,
            String text,
            String imagePath,
            String authorName,
            String authorLogin,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            Boolean redacted,
            Integer likes
    ) {
        this.id = id;
        this.text = text;
        this.imagePath = imagePath;
        this.authorName = authorName;
        this.authorLogin = authorLogin;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.redacted = redacted;
        this.likes = likes;
        this.likedByCurrentUser = false;
        this.isAuthor = false;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getAuthorLogin() { return authorLogin; }
    public void setAuthorLogin(String authorLogin) { this.authorLogin = authorLogin; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Boolean getRedacted() { return redacted; }
    public void setRedacted(Boolean redacted) { this.redacted = redacted; }

    public Integer getLikes() { return likes; }
    public void setLikes(Integer likes) { this.likes = likes; }

    public Boolean getLikedByCurrentUser() { return likedByCurrentUser; }
    public void setLikedByCurrentUser(Boolean likedByCurrentUser) {
        this.likedByCurrentUser = likedByCurrentUser;
    }

    public Boolean getIsAuthor() { return isAuthor; }
    public void setIsAuthor(Boolean isAuthor) { this.isAuthor = isAuthor; }

}
