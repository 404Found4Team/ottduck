package com.youflex.service.qna;

import java.util.List;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.youflex.dto.qna.QnaReportDTO;
import com.youflex.mapper.qna.QnaReportMapper;

@Service
@RequiredArgsConstructor
public class QnaReportService {

    private final QnaReportMapper qnaReportMapper;

    public void reportQna(QnaReportDTO reportDTO) {
        qnaReportMapper.insertQnaReport(reportDTO);
    }

    public List<QnaReportDTO> getReportList() {
        return qnaReportMapper.selectQnaReportList();
    }

    public void processReport(int qnaReportId, String status) {
        qnaReportMapper.updateQnaReportStatus(qnaReportId, status);
    }
}
