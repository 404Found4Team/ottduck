// 아이디/이메일 중복확인 공용 로직(예전엔 두 필드가 거의 같은 코드를 각각 들고 있었음, 하나로 합침).
// 레이스 컨디션 방지: 응답이 도착한 시점에 입력값이 이미 바뀌었으면 그 응답은 버리고,
// isChecked()도 "마지막으로 확인 성공한 값 === 지금 입력값"까지 같이 봐서 이중으로 막는다.
function setupDuplicateCheck({ inputId, statusId, buttonId, endpoint, paramName, emptyMessage, availableMessage, takenMessage, errorMessage }) {
  const input = document.getElementById(inputId);
  const status = document.getElementById(statusId);
  let checked = false;
  let checkedValue = null; // 마지막으로 '사용 가능' 확인에 성공한 값

  function setStatus(message, ok) {
    status.textContent = message;
    status.className = 'id-status ' + (ok ? 'ok' : 'no');
  }

  document.getElementById(buttonId).addEventListener('click', () => {
    const value = input.value.trim();
    if (!value) {
      setStatus(emptyMessage, false);
      checked = false;
      return;
    }
    fetch(`${endpoint}?${paramName}=` + encodeURIComponent(value))
      .then((res) => {
        // res.ok를 확인하지 않으면 서버 에러(500 등)까지 "이미 사용 중"으로 잘못 표시됨
        // (data.available이 undefined라 falsy로 취급되던 버그)
        if (!res.ok) throw new Error('duplicate check request failed');
        return res.json();
      })
      .then((data) => {
        if (input.value.trim() !== value) return; // 응답 도착 전에 값이 바뀜 -> 이 응답은 지금과 무관하니 버림
        if (data.available) {
          setStatus(availableMessage, true);
          checked = true;
          checkedValue = value;
        } else {
          setStatus(takenMessage, false);
          checked = false;
          checkedValue = null;
        }
      })
      .catch(() => {
        if (input.value.trim() !== value) return;
        setStatus(errorMessage, false);
        checked = false;
        checkedValue = null;
      });
  });

  // 중복확인 통과 후 값을 다시 수정하면 이전 확인 결과는 무효화(재확인 강제)
  input.addEventListener('input', () => { checked = false; });

  return {
    input,
    status,
    isChecked: () => checked && checkedValue === input.value.trim(),
  };
}

const idCheck = setupDuplicateCheck({
  inputId: 'member_loginid',
  statusId: 'idStatus',
  buttonId: 'idCheckBtn',
  endpoint: '/join/check-id',
  paramName: 'loginId',
  emptyMessage: '아이디를 입력해주세요.',
  availableMessage: '사용 가능한 아이디입니다.',
  takenMessage: '이미 사용 중인 아이디입니다.',
  errorMessage: '중복확인 중 오류가 발생했습니다.',
});

const emailCheck = setupDuplicateCheck({
  inputId: 'member_email',
  statusId: 'emailStatus',
  buttonId: 'emailCheckBtn',
  endpoint: '/join/check-email',
  paramName: 'email',
  emptyMessage: '이메일을 입력해주세요.',
  availableMessage: '사용 가능한 이메일입니다.',
  takenMessage: '이미 사용 중인 이메일입니다.',
  errorMessage: '중복확인 중 오류가 발생했습니다.',
});

const pwInput = document.getElementById('member_pwd');
const pwConfirmInput = document.getElementById('pwConfirmInput');
const pwMatch = document.getElementById('pwMatch');
const MIN_PW_LENGTH = 4;

// 비밀번호 규칙 체크리스트 항목 하나의 표시(✓/○, ok 클래스)를 갱신
function setRule(id, ok) {
  const li = document.getElementById(id);
  li.classList.toggle('ok', ok);
  li.querySelector('.mark').textContent = ok ? '✓' : '○';
}

// 비밀번호 입력 중 실시간으로 길이 규칙 체크 + 비밀번호 확인란과 일치 여부 갱신
pwInput.addEventListener('input', () => {
  setRule('rule-len', pwInput.value.length >= MIN_PW_LENGTH);
  checkMatch();
});

// 비밀번호와 비밀번호 확인 입력값이 일치하는지 실시간으로 안내
function checkMatch() {
  if (!pwConfirmInput.value) { pwMatch.textContent = ''; return; }
  if (pwInput.value === pwConfirmInput.value) {
    pwMatch.textContent = '비밀번호가 일치합니다.';
    pwMatch.className = 'pw-match ok';
  } else {
    pwMatch.textContent = '비밀번호가 일치하지 않습니다.';
    pwMatch.className = 'pw-match no';
  }
}
pwConfirmInput.addEventListener('input', checkMatch);

// 취향(장르) 선택 모달을 화면에 표시
function openGenreModal() {
  document.getElementById('genreModalBackdrop').classList.add('open');
}

// 실시간 체크리스트는 눈으로 보여주기만 할 뿐 제출을 막지는 않았던 문제 수정:
// 폼 제출 시점에 실제로 규칙을 검사해서, 통과 못 하면 취향 선택 모달로 못 넘어가게 막음.
document.getElementById('signupForm').addEventListener('submit', (e) => {
  e.preventDefault();

  // 중복확인 버튼을 안 눌렀거나(또는 확인 후 값을 바꿔서) 통과 상태가 아니면 제출 자체를 막음
  if (!idCheck.isChecked()) {
    idCheck.status.textContent = '아이디 중복확인을 먼저 해주세요.';
    idCheck.status.className = 'id-status no';
    idCheck.input.focus();
    return;
  }
  if (!emailCheck.isChecked()) {
    emailCheck.status.textContent = '이메일 중복확인을 먼저 해주세요.';
    emailCheck.status.className = 'id-status no';
    emailCheck.input.focus();
    return;
  }

  if (pwInput.value.length < MIN_PW_LENGTH) {
    pwMatch.textContent = `비밀번호는 ${MIN_PW_LENGTH}자 이상이어야 합니다.`;
    pwMatch.className = 'pw-match no';
    pwInput.focus();
    return;
  }
  if (pwInput.value !== pwConfirmInput.value) {
    pwMatch.textContent = '비밀번호가 일치하지 않습니다.';
    pwMatch.className = 'pw-match no';
    pwConfirmInput.focus();
    return;
  }

  openGenreModal();
});

// ---- 취향 선택 모달: 최대 3개까지만 선택 가능 (app.js의 공용 genre-chip 핸들러는
//      #genreGrid를 건너뛰므로 여기서만 처리) ----
const MAX_GENRE_SELECT = 3;
const genreGrid = document.getElementById('genreGrid');
genreGrid.querySelectorAll('.genre-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    const selectedCount = genreGrid.querySelectorAll('.genre-chip.selected').length;
    if (!chip.classList.contains('selected') && selectedCount >= MAX_GENRE_SELECT) {
      alert(`관심 장르는 최대 ${MAX_GENRE_SELECT}개까지 선택할 수 있어요.`);
      return;
    }
    chip.classList.toggle('selected');
  });
});

// 장르 선택 모달의 "완료"/"나중에 설정하기" 클릭 시 선택된 장르 id를 hidden input으로 담아
// 실제 회원가입 폼(/join)을 제출. 선택을 안 했으면(스킵) 장르 없이 그대로 제출됨.
// signupSubmitting: 두 버튼을 빠르게 연타하면 finishSignup이 중복 실행되어 같은 genreCategoryIds가
// hidden input으로 두 번 쌓인 채 제출될 수 있었던 문제(member_mapping의 uq_member_mapping UNIQUE
// 제약 위반으로 이어질 수 있음) 방지용 가드.
let signupSubmitting = false;
function finishSignup() {
  if (signupSubmitting) return;
  signupSubmitting = true;
  const form = document.getElementById('signupForm');
  genreGrid.querySelectorAll('.genre-chip.selected').forEach((chip) => {
    const hidden = document.createElement('input');
    hidden.type = 'hidden';
    hidden.name = 'genreCategoryIds';
    hidden.value = chip.dataset.genreId;
    form.appendChild(hidden);
  });
  form.submit();
}

document.getElementById('genreDoneBtn').addEventListener('click', finishSignup);
document.getElementById('genreSkipBtn').addEventListener('click', finishSignup);
