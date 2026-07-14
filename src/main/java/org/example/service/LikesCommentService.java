package org.example.service;

import org.example.entity.Comment;
import org.example.entity.LikesComment;
import org.example.entity.User;
import org.example.repository.CommentRepository;
import org.example.repository.LikesCommentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LikesCommentService {

    private final LikesCommentRepository likesCommentRepository;
    private final CommentRepository commentRepository;

    public LikesCommentService(LikesCommentRepository likesCommentRepository, CommentRepository commentRepository) {
        this.likesCommentRepository = likesCommentRepository;
        this.commentRepository = commentRepository;
    }

    @Transactional
    public void likeComment(Long commentId, User user) {
        Comment comment = commentExists(commentId);
        if (likesCommentRepository.existsByCommentAndUser(comment, user)) {
            throw new IllegalArgumentException("Вы уже поставили лайк");
        }

        LikesComment like = new LikesComment(comment, user);
        likesCommentRepository.save(like);
    }

    @Transactional
    public void unlikeComment(Long commentId, User user) {
        Comment comment = commentExists(commentId);
        likesCommentRepository.deleteByCommentAndUser(comment, user);
    }

    public boolean hasUserLiked(Long commentId, User user) {
        Comment comment = commentExists(commentId);
        return likesCommentRepository.existsByCommentAndUser(comment, user);
    }

    public Integer getLikesCount(Long commentId) {
        Comment comment = commentExists(commentId);
        return likesCommentRepository.countByComment(comment);
    }

    private Comment commentExists(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(
                        () -> new IllegalArgumentException("Комментарий не найден")
                );
        return comment;
    }

}
