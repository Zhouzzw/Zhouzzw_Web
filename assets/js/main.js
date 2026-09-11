/**
 * main.js — 导航栏、视频弹窗、技术栈筛选
 */

/* 字符矩阵背景（char-matrix.js 导入即自动初始化 #charMatrix，勿重复调用） */
import './char-matrix.js';

/* ===== 导航栏滚动状态 =====
   悬浮胶囊导航：滚动后微缩放 + 轻微透明
*/
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const updateNav = () => {
    const scrolled = window.scrollY > 60;
    nav.classList.toggle('nav--scrolled', scrolled);
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

/* ===== 滚动区域高亮（scrollspy） =====
   监听滚动，根据当前所在 section 高亮导航链接
*/
function initScrollSpy() {
  const links = document.querySelectorAll('.nav__links a');
  if (!links.length) return;

  // href="#xxx" → 对应链接
  const linkByHref = {};
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) linkByHref[href.slice(1)] = link;
  });

  // 只观察有对应导航链接的 section（intro 等无独立导航项的归入前一个区域）
  const sections = Array.from(document.querySelectorAll('section[id]'))
    .filter(s => linkByHref[s.id]);
  if (!sections.length) return;

  const NAV_OFFSET = 120; // 固定导航高度 + 缓冲

  // 滑动指示器：跟随当前链接平滑移动（top/height 垂直对齐链接，translateX 水平滑动）
  const indicator = document.querySelector('.nav__links-indicator');
  const placeIndicator = (link) => {
    if (!indicator || !link) return;
    indicator.style.width = `${link.offsetWidth}px`;
    indicator.style.height = `${link.offsetHeight}px`;
    indicator.style.top = `${link.offsetTop}px`;
    indicator.style.transform = `translateX(${link.offsetLeft}px)`;
  };

  const update = () => {
    const pos = window.scrollY + NAV_OFFSET;
    let currentId = sections[0].id;

    for (const s of sections) {
      if (s.offsetTop <= pos) currentId = s.id;
      else break;
    }

    // 滚动到底部时锁定最后一个 section
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      currentId = sections[sections.length - 1].id;
    }

    links.forEach(l => l.classList.remove('nav--active'));
    const active = linkByHref[currentId];
    if (active) {
      active.classList.add('nav--active');
      placeIndicator(active);
    }
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

/* ===== 视频弹窗 ===== */
function initVideoModal() {
  const covers = document.querySelectorAll('.video-cover');
  if (!covers.length) return;

  // 确保只有一个 modal
  let modal = document.getElementById('video-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'video-modal';
    modal.className = 'video-modal';
    modal.innerHTML = `
      <div class="video-modal__inner">
        <button class="video-modal__close" aria-label="关闭">&times;</button>
        <div class="video-modal__content"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const content = modal.querySelector('.video-modal__content');
  const closeBtn = modal.querySelector('.video-modal__close');

  covers.forEach(cover => {
    cover.addEventListener('click', () => {
      // 本地视频从内部 <video> 读 src —— Vite 构建时已重写过这个属性（含 hash 和 base），
      // data-video-src 只用于外链封面
      const inlineVideo = cover.querySelector('video');
      const src = inlineVideo?.getAttribute('src') || cover.dataset.videoSrc;
      const type = cover.dataset.videoType || 'youtube';

      // 竖版封面弹窗换 9:16 容器，避免 16/9 容器上下裁切
      const inner = modal.querySelector('.video-modal__inner');
      inner.classList.toggle('video-modal__inner--portrait', cover.classList.contains('video-cover--portrait'));

      if (type === 'youtube') {
        content.innerHTML = `
          <iframe
            src="${src}?autoplay=1"
            allow="autoplay; fullscreen"
            allowfullscreen
          ></iframe>`;
      } else {
        content.innerHTML = `
          <video src="${src}" controls autoplay></video>`;
      }

      modal.classList.add('is-open');
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('is-open');
    content.innerHTML = '';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('is-open');
      content.innerHTML = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      modal.classList.remove('is-open');
      content.innerHTML = '';
    }
  });
}

/* ===== 技术栈筛选 ===== */
function initTechFilter() {
  const btns = document.querySelectorAll('.tech-filter__btn');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      btns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const categories = document.querySelectorAll('.tech-cat');
      categories.forEach(cat => {
        const match = filter === 'all' || cat.dataset.category === filter;
        cat.classList.toggle('is-dimmed', !match);
      });
    });
  });
}

/* ===== 初始化 ===== */
/* ===== 视频封面截取首帧 ===== */
function initVideoCovers() {
  const covers = document.querySelectorAll('.video-cover video');
  covers.forEach(v => {
    const seekAndPause = () => {
      v.currentTime = 0.5;
      v.removeEventListener('loadeddata', seekAndPause);
    };
    v.addEventListener('loadeddata', seekAndPause);
    v.addEventListener('seeked', () => { v.pause(); }, { once: true });
    v.load();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollSpy();
  initVideoModal();
  initTechFilter();
  initVideoCovers();
});
