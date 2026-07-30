/**
 * animations.js — IntersectionObserver 滚动入场动画
 */

/* ===== CSS 动画关键帧 (注入) ===== */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

/* ===== IntersectionObserver 动画 ===== */
function initScrollAnimations() {
  const targets = document.querySelectorAll('.animate-on-scroll');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -30px 0px',
    }
  );

  targets.forEach(el => observer.observe(el));
}

/* ===== prefers-reduced-motion ===== */
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function handleMotionPreference(e) {
  if (e.matches) {
    // 禁用所有动画
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.style.transition = 'none';
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }
}

motionQuery.addEventListener('change', handleMotionPreference);
handleMotionPreference(motionQuery);

/* ===== 初始化 ===== */
document.addEventListener('DOMContentLoaded', initScrollAnimations);
