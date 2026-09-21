/**
 * animations.js — IntersectionObserver 滚动入场动画 + 数字滚动计数（B4）
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

/* ===== 数字滚动计数（B4） =====
   量化成果（.js-count）进入视口时从 0 计数到终值。
   终值就是 HTML 里的原文本：无 JS / 爬虫 / IntersectionObserver 缺失时什么都不做，
   页面天然显示终值 —— 渐进增强，零退化路径。
   动画前按终值实测锁 min-width + tabular-nums（见 style.css），数字增长不推挤同句文字；
   结束后归还 min-width，最终布局与「从未跑过 JS」完全一致。 */
function initCountUp() {
  const els = document.querySelectorAll('.js-count');
  if (!els.length || !('IntersectionObserver' in window)) return;

  const DURATION = 1200;
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const run = (el) => {
    const to = parseFloat(el.dataset.to);
    if (Number.isNaN(to)) return;

    // 减动效用户随时可能开启：开启则直接跳终值（终值本来就在标记里，等于零成本兜底）
    if (motionQuery.matches) return;

    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const fmt = (v) => v.toFixed(decimals) + suffix;

    // 锁宽：此刻文本就是终值，实测宽度即终值宽度
    el.style.minWidth = `${el.offsetWidth}px`;

    let start = null;
    const frame = (ts) => {
      if (start === null) start = ts;
      let p = Math.min(1, (ts - start) / DURATION);
      if (motionQuery.matches) p = 1;
      el.textContent = fmt(to * easeOutCubic(p));
      if (p < 1) {
        requestAnimationFrame(frame);
      } else {
        el.style.minWidth = '';
      }
    };
    requestAnimationFrame(frame);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        run(entry.target);
      });
    },
    {
      threshold: 0.6,
      rootMargin: '0px 0px -10% 0px',
    }
  );

  els.forEach((el) => observer.observe(el));
}

/* ===== B3 Hero 终端打字机 =====
   $ 提示符静态、命令逐字打出（终值就在 HTML 里：无 JS / 减动效直接整行显示，零退化）。
   打字只改 .hero__term-text 的文本内容，行高恒定 → 页面总高打字前后不变。
   延迟 700ms 起打，让 kicker / title 的 fadeUp 先起势，不抢戏。 */
function initTypewriter() {
  const el = document.querySelector('.hero__term-text');
  if (!el) return;
  // 与入场动画同一增强门槛；减动效用户不打字（终值本来就在标记里）
  if (!('IntersectionObserver' in window) || motionQuery.matches) return;

  const text = el.textContent;
  const TYPE_MS = 90;
  const START_DELAY = 700;

  el.textContent = '';
  let i = 0;
  const tick = () => {
    // 打字中途开启减动效 → 跳过余下逐字，直接补全
    if (motionQuery.matches) {
      el.textContent = text;
      return;
    }
    el.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(tick, TYPE_MS);
  };
  setTimeout(tick, START_DELAY);
}

/* ===== 螺旋动画节能门控（A3） =====
   hero 螺旋的 16 圈旋转在滚出视口 / 页面切后台时暂停（is-paused → animation-play-state），
   旋转本身不再消耗光栅化资源；回到视口/前台自动恢复。
   启动由 index.html head 脚本在 load+600ms 加 html.spiral-on 负责（A2），本函数只管暂停。 */
function initSpiralGating() {
  const visual = document.querySelector('.hero__visual');
  if (!visual || !('IntersectionObserver' in window)) return;

  let inView = true;
  const update = () => {
    visual.classList.toggle('is-paused', document.hidden || !inView);
  };

  new IntersectionObserver((entries) => {
    inView = entries[entries.length - 1].isIntersecting;
    update();
  }, { threshold: 0 }).observe(visual);

  document.addEventListener('visibilitychange', update);
}

/* ===== 初始化 ===== */
document.addEventListener('DOMContentLoaded', initScrollAnimations);
document.addEventListener('DOMContentLoaded', initCountUp);
document.addEventListener('DOMContentLoaded', initTypewriter);
document.addEventListener('DOMContentLoaded', initSpiralGating);
