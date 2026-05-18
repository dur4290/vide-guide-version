/* =========================================================
   hint.js — 힌트/답 자유 토글
   ========================================================= */

/* 콘텐츠 주입 후 호출 */
function initHints() {
  document.querySelectorAll('.hint-toggle').forEach(btn => {
    /* 이미 바인딩된 경우 방지 */
    if (btn.dataset.hintInit) return;
    btn.dataset.hintInit = '1';

    const content = btn.nextElementSibling;
    if (!content) return;

    /* 초기 상태: 닫힘 */
    content.classList.add('hidden');

    btn.addEventListener('click', () => {
      const isOpen = !content.classList.contains('hidden');
      content.classList.toggle('hidden', isOpen);
      btn.classList.toggle('open', !isOpen);
    });
  });
}
