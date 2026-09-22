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

    links.forEach(l => {
      l.classList.remove('nav--active');
      l.removeAttribute('aria-current');
    });
    const active = linkByHref[currentId];
    if (active) {
      active.classList.add('nav--active');
      // 纯视觉的 .nav--active 读屏读不出，补 aria-current 让辅助技术知道「当前在哪一节」
      active.setAttribute('aria-current', 'location');
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
  const inner = modal.querySelector('.video-modal__inner');
  const closeBtn = modal.querySelector('.video-modal__close');
  const close = () => closeDialog(modal);

  /* 弹层尺寸按视频真实比例自适应（竖版片段不再靠左右黑边凑 16:9）：
     在视口可用区内等比缩放，上限 max-width 960 / 视口高 − 弹层内边距。 */
  const MODAL_PAD = 64;   // var(--space-8) × 2
  let fitVideo = null;
  function fitModalTo(v) {
    if (!v.videoWidth || !v.videoHeight) return;
    const maxW = Math.min(960, window.innerWidth - MODAL_PAD);
    const maxH = window.innerHeight - MODAL_PAD;
    const ratio = v.videoWidth / v.videoHeight;
    let w = maxW;
    let h = w / ratio;
    if (h > maxH) {
      h = maxH;
      w = h * ratio;
    }
    inner.style.aspectRatio = 'auto';
    inner.style.width = `${Math.round(w)}px`;
    inner.style.height = `${Math.round(h)}px`;
  }
  function resetModalSize() {
    inner.style.aspectRatio = '';
    inner.style.width = '';
    inner.style.height = '';
    fitVideo = null;
  }
  window.addEventListener('resize', () => { if (fitVideo) fitModalTo(fitVideo); }, { passive: true });

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
        // poster + 覆盖层：移动端 autoplay 普遍被拦截，没有 poster 时弹层就是「一片黑」；
        // 覆盖层给出「点击播放 / 加载中 x%」，让用户知道是"在加载"而不是"坏了"。
        const poster = inlineVideo?.getAttribute('poster') || '';
        content.innerHTML = `
          <video src="${src}"${poster ? ` poster="${poster}"` : ''} controls playsinline></video>
          <div class="video-modal__overlay" data-overlay hidden>
            <button type="button" class="video-modal__play" data-play aria-label="播放视频"><span aria-hidden="true">▶</span></button>
            <p class="video-modal__hint" data-hint>加载中…</p>
          </div>`;
        const v = content.querySelector('video');
        const overlay = content.querySelector('[data-overlay]');
        const playBtn = content.querySelector('[data-play]');
        const hint = content.querySelector('[data-hint]');
        let started = false;

        const loadingText = () => {
          const buffered = v.buffered.length ? v.buffered.end(v.buffered.length - 1) : 0;
          const total = v.duration || 0;
          if (!total) return '加载中…';
          return `加载中 ${Math.min(99, Math.round(buffered / total * 100))}%`;
        };
        // 覆盖层默认隐藏（2026-09-22 方案 A）：能自动播放时全程不出现，不再一打开就盖住 poster。
        // 仅两种情况亮出：autoplay 被浏览器拦截（给「点击播放」按钮）/ 缓冲中（给「加载中 x%」文字）
        const showOverlay = (text, withButton) => {
          overlay.hidden = false;
          playBtn.hidden = !withButton || started;   // 缓冲提示不带动播放键；播放开始后也不再给
          hint.textContent = text;
        };
        const start = () => { v.play().catch(() => showOverlay('点击播放', true)); };

        v.addEventListener('playing', () => { started = true; overlay.hidden = true; });
        v.addEventListener('waiting', () => showOverlay(loadingText(), false));
        v.addEventListener('progress', () => { if (!overlay.hidden && !v.paused) hint.textContent = loadingText(); });
        overlay.addEventListener('click', start);
        playBtn.addEventListener('click', (e) => { e.stopPropagation(); start(); });

        // 主动发起播放（取代 <video autoplay>）：这样被拦截时能拿到 promise 结果并给出「点击播放」
        start();

        fitVideo = v;
        v.addEventListener('loadedmetadata', () => fitModalTo(v));
        fitModalTo(v);   // 元数据已在缓存时 loadedmetadata 不再触发，主动试一次
      }

      // 收尾回调：任何关闭路径（按钮 / ESC / 点遮罩）都要移除 video，否则会在后台继续播放
      openDialog(modal, '.video-modal__close', () => { content.innerHTML = ''; resetModalSize(); });
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

      btns.forEach(b => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        // I6：选中态要暴露给读屏 —— 只切 class 的话 aria-pressed 永远不更新
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });

      const categories = document.querySelectorAll('.tech-cat');
      categories.forEach(cat => {
        const match = filter === 'all' || cat.dataset.category === filter;
        cat.classList.toggle('is-dimmed', !match);
        // I6：被筛掉的分类只改了 opacity，仍在无障碍树里被逐条念出 —— 用 aria-hidden 与视觉状态对齐
        if (match) cat.removeAttribute('aria-hidden');
        else cat.setAttribute('aria-hidden', 'true');
      });
    });
  });
}

/* ===== C 方案：关键词标签的近距磁吸 =====
   输入只有「距离」：指针进入 R 半径后被拉向指针，最强 MAX 像素，离开回弹（CSS 过渡）。
   与 B5 高光同口径 —— 精细指针 + 支持 hover 才挂监听（触屏零开销），减动效直接不挂。
   一帧最多一次 rAF；先把几何读完再统一写 transform（读写分离，避免布局抖动）。 */
function initMagneticTags() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const groups = document.querySelectorAll('.project-item__tags');
  if (!groups.length) return;

  const R = 140;   // 吸附半径（px）
  const MAX = 8;   // 位移上限（px）—— 再大会让标签漂移/压字

  let x = 0;
  let y = 0;
  let raf = null;

  const clear = (el) => {
    el.style.transform = '';
    el.classList.remove('is-pulled');
  };

  function update() {
    // 读阶段：只量「可能受影响」的分组（指针 R 邻域内），远的整组复位
    const near = [];
    groups.forEach((group) => {
      const g = group.getBoundingClientRect();
      const hit = x > g.left - R && x < g.right + R && y > g.top - R && y < g.bottom + R;
      if (!hit) { near.push(null); return; }
      const items = [];
      group.querySelectorAll('.project-tag').forEach((el) => {
        const r = el.getBoundingClientRect();
        items.push({ el, cx: r.left + r.width / 2, cy: r.top + r.height / 2 });
      });
      near.push(items);
    });

    // 写阶段：近的按距离给位移，远的复位
    groups.forEach((group, i) => {
      const items = near[i];
      if (!items) {
        group.querySelectorAll('.project-tag.is-pulled').forEach(clear);
        return;
      }
      items.forEach(({ el, cx, cy }) => {
        const dx = x - cx;
        const dy = y - cy;
        const d = Math.hypot(dx, dy);
        if (d >= R || d === 0) { clear(el); return; }
        const k = (1 - d / R) ** 2;   // 近距急升、远距近零
        el.style.transform = `translate3d(${(dx / d * k * MAX).toFixed(2)}px, ${(dy / d * k * MAX).toFixed(2)}px, 0)`;
        el.classList.add('is-pulled');
      });
    });
  }

  window.addEventListener('pointermove', (e) => {
    x = e.clientX;
    y = e.clientY;
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = null; update(); });
  }, { passive: true });
}

/* ===== 播放键光圈环（纯装饰）=====
   2026-09-21：封面改用 `<video poster>` 静帧后，这里**不再做「seek 到 0.5s 截首帧」**——
   那条路径每张封面都要拉流数 MB（弱网实测 12.6s 才出画面）。换成 poster：0 个媒体请求、
   无 JS 也出图、微信内置浏览器同样可靠。本函数只负责注入 hover 画圆用的 SVG 环。 */
function initVideoRings() {
  const icons = document.querySelectorAll('.video-cover__play-icon');
  if (!icons.length) return;
  const RING = '<svg class="video-cover__ring" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="31"></circle></svg>';
  icons.forEach((icon) => icon.insertAdjacentHTML('afterbegin', RING));
}

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollSpy();
  initVideoModal();
  initTechFilter();
  initMagneticTags();
  initVideoRings();
  initScrollProgress();
  initContactCopy();
  initQrModal();
});
