// 상단 공통 네비게이션 바를 현재 탭(공지사항/Q&A)에 맞게 강조
// (body의 data-nav-current는 "notice"로 고정돼 있어서 그대로 두면 항상 공지사항만 강조됨)
function syncTopNavActive(target) {
  document.querySelectorAll('.category-nav a[data-nav]').forEach((a) => {
    a.classList.toggle('active', a.dataset.nav === target);
  });
}

function applyNoticeHashState() {
  const isQna = location.hash === '#qna';
  const targetBtn = document.querySelector(
    `.notice-tabs button[data-tab-target="${isQna ? 'qna' : 'notice'}"]`
  );
  targetBtn && targetBtn.click();
  syncTopNavActive(isQna ? 'qna' : 'notice');
}

// 공지사항/Q&A 목록 페이지네이션: app.js의 공통 initTablePagination 사용 (admin.js 신고 탭과 동일한 패턴 공유)

// 공지사항 검색 매칭: 제목만 대상 (작성자는 항상 "관리자" 고정이라 검색 의미 없음)
function matchNoticeRow(tr, keywordLower) {
  const titleText = tr.children[1] ? tr.children[1].textContent.toLowerCase() : '';
  return titleText.includes(keywordLower);
}

// Q&A 검색 매칭: 제목 OR 작성자 (리뷰 게시글 검색과 동일한 방식)
function matchQnaRow(tr, keywordLower) {
  const titleText = tr.children[1] ? tr.children[1].textContent.toLowerCase() : '';
  const authorText = tr.children[2] ? tr.children[2].textContent.toLowerCase() : '';
  return titleText.includes(keywordLower) || authorText.includes(keywordLower);
}

document.addEventListener('DOMContentLoaded', () => {
  applyNoticeHashState();

  // 페이지 안의 "공지사항"/"Q&A" 탭을 직접 눌렀을 때도 상단 네비게이션 강조를 같이 맞춰줌
  document.querySelectorAll('.notice-tabs button[data-tab-target]').forEach((btn) => {
    btn.addEventListener('click', () => syncTopNavActive(btn.dataset.tabTarget));
  });

  initTablePagination('noticeListBody', 'noticePagination', 10, 'noticeSearchKeyword', matchNoticeRow);
  initTablePagination('qnaListBody', 'qnaPagination', 10, 'qnaSearchKeyword', matchQnaRow);
});
// 05_notice.html 안에서 05_notice.html#qna 로 이동하는 것처럼 같은 문서 안 해시만 바뀌는 경우
// DOMContentLoaded가 다시 발생하지 않으므로 hashchange도 같이 들어야 함
window.addEventListener('hashchange', applyNoticeHashState);
