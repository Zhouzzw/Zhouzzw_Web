/**
 * main.js — 导航栏、视频弹窗、技术栈筛选
 */

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

/* ===== 弹层通用：焦点记忆 / 还原 + ESC / Tab 焦点陷阱 =====
   视频弹窗与二维码弹层共用。打开前记住触发元素、关闭后还原焦点，
   避免键盘用户关掉弹层后「不知道焦点跑到哪了」。
*/
let dialogLastFocus = null;
let dialogActive = null;
let dialogCleanup = null;

function openDialog(modal, focusSelector, onClose) {
  dialogLastFocus = document.activeElement;
  dialogActive = modal;
  dialogCleanup = typeof onClose === 'function' ? onClose : null;
  modal.classList.add('is-open');
  const target = modal.querySelector(focusSelector || '[data-dialog-close]');
  if (target) target.focus();
}

function closeDialog(modal) {
  if (!modal) return;
  modal.classList.remove('is-open');
  if (dialogActive === modal) {
    dialogActive = null;
    // 收尾回调（如清空视频元素）必须走这里，否则 ESC / 点遮罩关闭会漏掉
    if (dialogCleanup) {
      const fn = dialogCleanup;
      dialogCleanup = null;
      fn();
    }
  }
  if (dialogLastFocus && document.contains(dialogLastFocus)) {
    dialogLastFocus.focus();
    dialogLastFocus = null;
  }
}

document.addEventListener('keydown', (e) => {
  if (!dialogActive) return;

  if (e.key === 'Escape') {
    closeDialog(dialogActive);
    return;
  }
  if (e.key !== 'Tab') return;

  // 焦点陷阱：只在弹层内的可聚焦元素之间循环
  const items = [...dialogActive.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )];
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

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
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', '视频播放');
    modal.innerHTML = `
      <div class="video-modal__inner">
        <button type="button" class="video-modal__close" data-dialog-close aria-label="关闭视频">&times;</button>
        <div class="video-modal__content"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const content = modal.querySelector('.video-modal__content');
  const closeBtn = modal.querySelector('.video-modal__close');
  const close = () => closeDialog(modal);

  covers.forEach(cover => {
    cover.addEventListener('click', () => {
      // 本地视频从内部 <video> 读 src —— Vite 构建时已重写过这个属性（含 hash 和 base），
      // data-video-src 只用于外链封面
      const inlineVideo = cover.querySelector('video');
      const src = inlineVideo?.getAttribute('src') || cover.dataset.videoSrc;
      const type = cover.dataset.videoType || 'youtube';

      if (type === 'youtube') {
        content.innerHTML = `
          <iframe
            src="${src}?autoplay=1"
            allow="autoplay; fullscreen"
            allowfullscreen
          ></iframe>`;
      } else {
        // playsinline：缺失时 iOS Safari 会强制全屏播放
        content.innerHTML = `
          <video src="${src}" controls autoplay playsinline></video>`;
      }

      // 收尾回调：任何关闭路径（按钮 / ESC / 点遮罩）都要移除 video，否则会在后台继续播放
      openDialog(modal, '.video-modal__close', () => { content.innerHTML = ''; });
    });
  });

  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
}

/* ===== 微信二维码弹层 =====
   标记写在 index.html：Vite 需要重写 <img src> 的 base 前缀，JS 字符串里的路径不会被处理。
*/
function initQrModal() {
  const triggers = document.querySelectorAll('[data-qr]');
  const modal = document.getElementById('qr-modal');
  if (!triggers.length || !modal) return;

  const closeBtn = modal.querySelector('.qr-modal__close');
  const close = () => closeDialog(modal);

  triggers.forEach(btn => btn.addEventListener('click', () => openDialog(modal, '.qr-modal__close')));
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
}

/* ===== 顶部滚动进度条 =====
   装饰性元素，由 JS 注入（无 JS 时不出现，正文不受影响）。
   只用 transform: scaleX，不触发 layout，也不带过渡（避免变成新的动效源）。
*/
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bar.style.transform = `scaleX(${ratio})`;
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

/* ===== 联系方式一键复制 =====
   微信/QQ 号这类长数字手输易错。非安全上下文或无权限时，
   退化为「选中文本 + 提示手动复制」，不静默失败。
*/
function initContactCopy() {
  const btns = document.querySelectorAll('[data-copy]');
  if (!btns.length) return;

  btns.forEach(btn => {
    const label = btn.textContent.trim();
    let timer = null;

    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      let copied = false;

      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch {
        // 退化路径：把值选中，用户可直接 Ctrl/Cmd+C
        const scope = btn.closest('.contact-item-big, .qr-modal__inner');
        const value = scope?.querySelector('.contact-item-big__value, .qr-modal__id strong');
        const sel = window.getSelection();
        if (value && sel) {
          const range = document.createRange();
          range.selectNodeContents(value);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }

      btn.textContent = copied ? '已复制' : '手动复制';
      btn.classList.toggle('is-copied', copied);

      clearTimeout(timer);
      timer = setTimeout(() => {
        btn.textContent = label;
        btn.classList.remove('is-copied');
      }, 1800);
    });
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
  initScrollProgress();
  initContactCopy();
  initQrModal();
});
