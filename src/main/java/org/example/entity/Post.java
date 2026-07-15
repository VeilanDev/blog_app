package org.example.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "text", nullable = false, length = 4096)
    private String text;

    @Column(name = "image_url", length = 512)
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;

    @Column(name = "redacted", nullable = false)
    private Boolean redacted = false;

    @Column(name = "use_markdown", nullable = false)
    private Boolean useMarkdown = false;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LikesPost> likesList = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> commentsList = new ArrayList<>();

    public Post() {}
    public Post(String text, String imageUrl) {
        this.text = text;
        this.imageUrl = imageUrl;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public User getAuthor() {
        return author;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public String getText() {
        return text;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public List<LikesPost> getLikesList() {
        return likesList;
    }

    public List<Comment> getCommentsList() {
        return commentsList;
    }

    public Integer getLikes() {
        return likesList.size();
    }

    public Boolean getRedacted() {
        return redacted;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setLikesList(List<LikesPost> likesList) {
        this.likesList = likesList;
    }

    public void setCommentsList(List<Comment> commentsList) {
        this.commentsList = commentsList;
    }

    public void setRedacted(Boolean redacted) {
        this.redacted = redacted;
    }

    public Boolean getUseMarkdown() {
        return useMarkdown;
    }

    public void setUseMarkdown(Boolean useMarkdown) {
        this.useMarkdown = useMarkdown;
    }
}
