package com.ottduck.mapper.qna;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import com.ottduck.dto.qna.QnaCommentDTO;

@Mapper
public interface QnaCommentMapper {
    List<QnaCommentDTO> selectCommentsByQnaId(int qnaId);
    void insertComment(QnaCommentDTO commentDTO);
    QnaCommentDTO selectCommentById(int qnaCommentId);
    void updateComment(QnaCommentDTO commentDTO);
    void deleteComment(int qnaCommentId);
}
