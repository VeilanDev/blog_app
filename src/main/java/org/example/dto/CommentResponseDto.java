package org.example.dto;

import java.time.LocalDateTime;

public class CommentResponseDto {
    private Long id;
    private Long postId;
    private String authorName;
    private String authorLogin;
    private String text;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean redacted;
    private Boolean isAuthor;
    private Integer likes;
    private Boolean likedByCurrentUser;

    public CommentResponseDto(
            Long id,
            Long postId,
            String authorName,
            String authorLogin,
            String text,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            Boolean redacted,
            Integer likes
    ) {
        this.id = id;
        this.postId = postId;
        this.authorName = authorName;
        this.authorLogin = authorLogin;
        this.text = text;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.redacted = redacted;
        this.isAuthor = false;
        this.likes = likes;
        this.likedByCurrentUser = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
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

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
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

    public Boolean getAuthor() {
        return isAuthor;
    }

    public void setAuthor(Boolean author) {
        isAuthor = author;
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
}
