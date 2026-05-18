/* =========================================================
   progress.js — localStorage 기반 진도 관리
   ========================================================= */

const STORAGE_KEY = 'vibe-guide-progress';

const CHAPTERS = ['intro', 'ch1', 'ch2', 'ch3', 'ch4', 'ch5'];

/* 전체 진도 계산용 단계 목록
   챕터 HTML은 한 번에 하나만 로드되므로 DOM만 보면 현재 챕터 진도만 계산됩니다. */
const CHAPTER_STEPS = {
  intro: [],
  ch1: ['ch1-s1', 'ch1-s2', 'ch1-s3', 'ch1-s4', 'ch1-s5', 'ch1-s6'],
  ch2: ['ch2-s1', 'ch2-s2', 'ch2-s3', 'ch2-s4'],
  ch3: ['ch3-s1', 'ch3-s2', 'ch3-s3', 'ch3-s4', 'ch3-s5', 'ch3-s6', 'ch3-s11', 'ch3-s7', 'ch3-s8', 'ch3-s9', 'ch3-s10'],
  ch4: ['ch4-s1', 'ch4-s2', 'ch4-s3', 'ch4-s4', 'ch4-s5', 'ch4-s6'],
  ch5: ['ch5-s1', 'ch5-s2', 'ch5-s3', 'ch5-s4', 'ch5-s5', 'ch5-s6', 'ch5-s7', 'ch5-s8'],
};

/* 저장된 진도 불러오기 (없으면 초기화) */
function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/* 진도 저장 */
function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* 저장 실패 무시 */
  }
}

/* 특정 챕터의 체크박스 상태 불러오기 */
function getChapterProgress(chapter) {
  const data = loadProgress();
  return data[chapter] || {};
}

/* 체크박스 상태 저장 */
function setStepDone(chapter, stepId, done) {
  const data = loadProgress();
  if (!data[chapter]) data[chapter] = {};
  data[chapter][stepId] = done;
  saveProgress(data);
  updateProgressBar();
  updateSidebarDots();
}

/* 전체 진도 % 계산 */
function calcTotalPct() {
  const data = loadProgress();
  let total = 0, done = 0;

  Object.entries(CHAPTER_STEPS).forEach(([chapter, stepIds]) => {
    stepIds.forEach(stepId => {
      total++;
      if (data[chapter] && data[chapter][stepId]) done++;
    });
  });

  return total === 0 ? 0 : Math.round((done / total) * 100);
}

/* 헤더 진도바 업데이트 */
function updateProgressBar() {
  const pct = calcTotalPct();
  const fill = document.getElementById('progress-fill');
  const pctEl = document.getElementById('progress-pct');
  if (fill) fill.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct + '%';
}

/* 사이드바 점 (완료 챕터 표시) */
function updateSidebarDots() {
  const data = loadProgress();

  CHAPTERS.forEach(ch => {
    const navItem = document.querySelector(`.nav-item[data-chapter="${ch}"]`);
    if (!navItem) return;

    const steps = CHAPTER_STEPS[ch] || [];
    if (steps.length === 0) {
      navItem.classList.remove('done');
      return;
    }

    const allDone = steps.every(stepId => data[ch] && data[ch][stepId]);

    navItem.classList.toggle('done', allDone);
  });
}

/* 현재 챕터 체크박스 초기화 (콘텐츠 주입 후 호출) */
function initChapterProgress(chapter) {
  const chData = getChapterProgress(chapter);

  document.querySelectorAll('.step-complete').forEach(label => {
    const stepId = label.dataset.stepId;
    if (!stepId) return;

    label.dataset.chapter = chapter;

    const checkbox = label.querySelector('input[type="checkbox"]');
    if (!checkbox) return;

    const isDone = !!(chData[stepId]);
    checkbox.checked = isDone;
    label.classList.toggle('checked', isDone);

    checkbox.addEventListener('change', () => {
      const done = checkbox.checked;
      label.classList.toggle('checked', done);
      setStepDone(chapter, stepId, done);
    });

    /* 라벨 클릭으로도 토글 */
    label.addEventListener('click', (e) => {
      if (e.target === checkbox) return;
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change'));
    });
  });

  updateProgressBar();
  updateSidebarDots();
}
