package org.example.service;

import org.example.dto.CommentResponseDto;
import org.example.repository.CommentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class CommentService {

    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public Page<CommentResponseDto> getComments(int page, int size, String currentUserLogin) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<CommentResponseDto> comments = commentRepository.findAllComments(pageable);

        return comments;
    }

    public Page<CommentResponseDto> getPostComments(Long postId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<CommentResponseDto> comments = commentRepository.findCommentsByPostIdPaged(postId, pageable);

        return comments;
    }
}
