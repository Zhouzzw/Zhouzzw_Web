/**
 * main.js — 导航栏、视频弹窗、技术栈筛选
 */

/* ===== 导航栏滚动变色 ===== */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const updateNav = () => {
    const scrolled = window.scrollY > 80;
    nav.classList.toggle('nav--scrolled', scrolled);
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

/* ===== 当前页面高亮 ===== */
function initActiveLink() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav__links a');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === current) {
      link.classList.add('nav--active');
    }
  });
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
      const src = cover.dataset.videoSrc;
      const type = cover.dataset.videoType || 'youtube';

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

      const categories = document.querySelectorAll('.tech-category');
      categories.forEach(cat => {
        if (filter === 'all' || cat.dataset.category === filter) {
          cat.style.display = '';
        } else {
          cat.style.display = 'none';
        }
      });
    });
  });
}

/* ===== 初始化 ===== */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initActiveLink();
  initVideoModal();
  initTechFilter();
});
