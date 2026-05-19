/* =========================================================
   router.js — 해시 기반 SPA 라우터
   ========================================================= */

const ROUTES = {
  ''      : 'chapters/intro.html',
  'intro' : 'chapters/intro.html',
  'ch1'   : 'chapters/ch1-setup.html',
  'ch2'   : 'chapters/ch2-claude.html',
  'ch3'   : 'chapters/ch3-git.html',
  'ch4'   : 'chapters/ch4-markdown.html',
  'ch5'   : 'chapters/ch5-project.html',
};

const CONTENT_VERSION = '20260519-02';

let currentChapter = null;

/* 해시에서 챕터 추출: #/ch1 → 'ch1' */
function getChapter() {
  const hash = location.hash.replace('#/', '').replace('#', '').split('?')[0];
  return hash || '';
}

/* 챕터 로드 */
async function loadChapter(chapter) {
  if (chapter === currentChapter) return;

  const path = ROUTES[chapter] || ROUTES['intro'];
  const contentEl = document.getElementById('content-inner');

  /* file:// 프로토콜에서는 fetch()가 동작하지 않음 */
  if (location.protocol === 'file:') {
    contentEl.innerHTML = `
      <div style="max-width:600px;margin:60px auto;padding:0 24px;">
        <div class="callout callout-warn" style="margin-bottom:24px;">
          <span class="callout-icon">⚠️</span>
          <div>
            <strong>로컬 서버가 필요해요</strong>
            <p>파일을 직접 열면 브라우저 보안 정책 때문에 콘텐츠를 불러올 수 없어요.<br>
            아래 방법 중 하나로 열어주세요.</p>
          </div>
        </div>
        <div class="callout callout-tip" style="margin-bottom:16px;">
          <span class="callout-icon">💡</span>
          <div>
            <strong>방법 1 — VS Code Live Server (추천)</strong>
            <ol style="margin:8px 0 0;padding-left:20px;line-height:2;">
              <li>VS Code에서 이 폴더를 열어요</li>
              <li>오른쪽 하단 <code>Go Live</code> 버튼 클릭</li>
              <li>브라우저가 자동으로 열려요</li>
            </ol>
            <p style="margin:8px 0 0;font-size:0.85em;opacity:0.7;">Live Server 확장이 없으면: VS Code 확장 탭 → "Live Server" 검색 → 설치</p>
          </div>
        </div>
        <div class="callout callout-tip">
          <span class="callout-icon">💡</span>
          <div>
            <strong>방법 2 — Python 서버</strong>
            <p>터미널에서 이 폴더 위치로 이동 후:</p>
            <pre style="margin:8px 0 0;"><code class="language-bash">python -m http.server 8080</code></pre>
            <p style="margin:8px 0 0;">그 다음 브라우저에서: <code>http://localhost:8080</code></p>
          </div>
        </div>
      </div>`;
    return;
  }

  contentEl.innerHTML = '<div class="loading">불러오는 중...</div>';

  try {
    const separator = path.includes('?') ? '&' : '?';
    const res = await fetch(`${path}${separator}v=${CONTENT_VERSION}`);
    if (!res.ok) throw new Error(res.statusText);
    const html = await res.text();
    contentEl.innerHTML = html;
  } catch (e) {
    contentEl.innerHTML = `
      <div class="callout callout-danger">
        <span class="callout-icon">⚠️</span>
        <div>
          <strong>페이지를 불러올 수 없어요</strong>
          <p>파일이 존재하는지 확인해주세요.<br>
          챕터 파일: <code>${path}</code></p>
        </div>
      </div>`;
    return;
  }

  currentChapter = chapter;

  /* 코드 하이라이팅 */
  if (window.hljs) {
    document.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
  }

  /* 힌트 초기화 */
  if (window.initHints) initHints();

  /* 진도 초기화 */
  if (window.initChapterProgress) initChapterProgress(chapter || 'intro');

  /* 사이드바 활성 표시 */
  updateActiveNav(chapter);

  /* 스크롤 상단으로 */
  window.scrollTo({ top: 0, behavior: 'instant' });
}

/* 사이드바 active 표시 */
function updateActiveNav(chapter) {
  document.querySelectorAll('.nav-item').forEach(a => {
    const ch = a.dataset.chapter;
    const match = ch === (chapter || 'intro') || (ch === 'intro' && !chapter);
    a.classList.toggle('active', match);
  });
}

/* 테마 토글 */
function initTheme() {
  const saved = localStorage.getItem('vibe-theme') || 'light';
  document.documentElement.dataset.theme = saved;
  updateThemeBtn(saved);

  document.getElementById('theme-toggle').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('vibe-theme', next);
    updateThemeBtn(next);
  });
}

function updateThemeBtn(theme) {
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

/* 라우터 초기화 */
function initRouter() {
  initTheme();

  /* 초기 로드 */
  loadChapter(getChapter());

  /* 해시 변경 시 */
  window.addEventListener('hashchange', () => {
    loadChapter(getChapter());
  });
}

/* DOM 준비 후 시작 */
document.addEventListener('DOMContentLoaded', initRouter);
