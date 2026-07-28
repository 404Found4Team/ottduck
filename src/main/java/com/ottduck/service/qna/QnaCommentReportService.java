package com.ottduck.service.qna;

import java.util.List;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.ottduck.dto.qna.QnaCommentReportDTO;
import com.ottduck.mapper.qna.QnaCommentReportMapper;

@Service
@RequiredArgsConstructor
public class QnaCommentReportService {

    private final QnaCommentReportMapper qnaCommentReportMapper;

    public void reportComment(QnaCommentReportDTO reportDTO) {
        qnaCommentReportMapper.insertCommentReport(reportDTO);
    }

    public List<QnaCommentReportDTO> getReportList() {
        return qnaCommentReportMapper.selectCommentReportList();
    }

    public void processReport(int qnaCommentReportId, String status) {
        qnaCommentReportMapper.updateCommentReportStatus(qnaCommentReportId, status);
    }
}
