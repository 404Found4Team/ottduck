-- ============================================================
-- Q&A 답변 탭(admin/admin.html) "답변완료" 서브탭 경과일 테스트용 더미 데이터
-- qna 1건 + admin_answer 1건 생성, admin_answer_created_at을 5일 전으로 넣어서
-- 관리자 페이지에 "5일 경과"로 표시되도록 함
-- (QNA_ANSWERED_VISIBLE_DAYS=7일 미만이라 답변완료 탭에 정상 노출됨
--  - AdminViewController.java의 qnaAnsweredList 필터링 로직 참고)
--
-- 질문 작성자 회원 1명도 함께 만들기 때문에 기존 DB에 데이터가 없어도 그대로 실행됩니다.
--
-- 실행: MySQL Workbench/DBeaver 등에서 ottduck 스키마 선택 후 전체 실행
-- ============================================================

USE ottduck;

-- (선택) 재실행 전 이전 테스트 데이터 정리하고 싶으면 아래 주석 해제
-- DELETE FROM admin_answer WHERE admin_answer_content LIKE '[TEST]%';
-- DELETE FROM qna WHERE qna_title LIKE '[TEST]%';
-- DELETE FROM member WHERE member_loginid = 'test_qna1';

-- 1. 테스트용 질문 작성자
INSERT INTO member (member_loginid, member_pwd, member_name, member_email, member_grade)
VALUES ('test_qna1', 'test1234', '테스트질문자1', 'test_qna_writer1@test.com', '시청자');

-- 2. 테스트용 질문 (답변완료 상태) - 질문은 6일 전에 작성된 것으로
INSERT INTO qna (member_id, qna_title, qna_content, qna_status, qna_created_at, qna_updated_at)
SELECT
  (SELECT member_id FROM member WHERE member_loginid = 'test_qna1'),
  '[TEST] 답변완료 경과일 테스트 질문입니다',
  '[TEST] 답변완료 탭에서 경과일(5일) 표시를 확인하기 위한 테스트 질문 본문입니다.',
  '답변완료',
  NOW() - INTERVAL 6 DAY,
  NOW() - INTERVAL 5 DAY;

-- 3. 테스트용 관리자 답변 - 5일 전에 답변한 것으로 (경과일 5일)
INSERT INTO admin_answer (qna_id, admin_answer_content, admin_answer_created_at, admin_answer_updated_at)
SELECT
  (SELECT qna_id FROM qna WHERE qna_title = '[TEST] 답변완료 경과일 테스트 질문입니다'),
  '[TEST] 답변완료 경과일 테스트용 관리자 답변입니다.',
  NOW() - INTERVAL 5 DAY,
  NOW() - INTERVAL 5 DAY;
