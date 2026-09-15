/**
 * animations.js — IntersectionObserver 滚动入场动画
 */

/* 就绪标记：index.html 的渐进增强兜底据此判断是否保留 .anim
   （本脚本若加载失败或报错，标记不会出现，兜底会移除 .anim 保证正文可见） */
document.documentElement.setAttribute('data-anim-ready', '1');

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
      threshold: 0.2,
      rootMargin: '0px 0px -15% 0px',
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
