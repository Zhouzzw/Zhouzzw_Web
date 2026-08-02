/**
 * char-matrix.js — Canvas 动态字符矩阵背景
 *
 * 网格化随机字符，每个格子独立时间步刷新，形成缓慢跳动的噪点质感。
 * 用于技术栈页面深色 section 背景，替代静态 text-watermark。
 *
 * 性能：
 *  - requestAnimationFrame 驱动
 *  - 页面不可见自动暂停（visibilitychange）
 *  - prefers-reduced-motion 降低刷新率
 *  - ResizeObserver 响应式重建
 */

/* ===== 配置 ===== */
const CONFIG = {
  // 字符池
  chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]<>/\\|=+-*&^%$#@!?~',
  // 字体（桌面端）
  fontSize: 12,
  fontSizeMobile: 10,
  fontFamily: '"Geist Mono", "JetBrains Mono", "Fira Code", monospace',
  // 网格行高（字符高度 + 间距）
  lineHeightRatio: 1.5,
  // 列宽比例（mono 下约 0.6em 宽度）
  colWidthRatio: 0.62,
  // 基础透明度范围（右栏动态区可以稍亮一些）
  opacityMin: 0.08,
  opacityMax: 0.28,
  // 刷新时高亮透明度
  flashOpacity: 0.55,
  // 高亮衰减时间 (ms)
  flashDuration: 250,
  // 每格变化间隔范围 (ms)
  changeIntervalMin: 600,
  changeIntervalMax: 3500,
  // 移动端断点
  mobileBreakpoint: 768,
};

/* ===== 工具函数 ===== */
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function randChar() {
  return CONFIG.chars[Math.floor(Math.random() * CONFIG.chars.length)];
}

function randInt(min, max) {
  return Math.floor(rand(min, max + 1));
}

/* ===== CharMatrix 类 ===== */
class CharMatrix {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.grid = [];         // 2D array of cell objects
    this.cols = 0;
    this.rows = 0;
    this.fontSize = CONFIG.fontSize;
    this.colWidth = 0;
    this.rowHeight = 0;
    this.rafId = null;
    this.lastTime = 0;
    this.running = false;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.frameAccumulator = 0;
    this.reducedFrameInterval = 120; // ms per frame when reduced motion
  }

  /* 初始化 */
  init() {
    this.resize();

    // 可见性变化：暂停/恢复
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else {
        this.start();
      }
    });

    // 窗口大小变化：重建网格
    let resizeTimer;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this.resize(), 150);
    });
    resizeObserver.observe(this.canvas.parentElement);

    this.start();
  }

  /* 重新计算尺寸 & 重建网格 */
  resize() {
    const parent = this.canvas.parentElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // 限制最大 2x，性能优先
    const w = parent.clientWidth;
    const h = parent.clientHeight;

    if (w === 0 || h === 0) return;

    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 响应式字号
    this.fontSize = window.innerWidth < CONFIG.mobileBreakpoint
      ? CONFIG.fontSizeMobile
      : CONFIG.fontSize;

    this.colWidth = Math.max(6, this.fontSize * CONFIG.colWidthRatio);
    this.rowHeight = this.fontSize * CONFIG.lineHeightRatio;

    this.cols = Math.ceil(w / this.colWidth);
    this.rows = Math.ceil(h / this.rowHeight);

    // 重建网格
    this.grid = [];
    for (let r = 0; r < this.rows; r++) {
      const row = [];
      for (let c = 0; c < this.cols; c++) {
        row.push(this._makeCell());
      }
      this.grid.push(row);
    }
  }

  /* 创建一个单元格 */
  _makeCell() {
    return {
      char: randChar(),
      baseOpacity: rand(CONFIG.opacityMin, CONFIG.opacityMax),
      currentOpacity: 0,
      flashStart: 0,
      nextChangeAt: rand(CONFIG.changeIntervalMin, CONFIG.changeIntervalMax),
    };
  }

  /* 启动动画 */
  start() {
    if (this.running || document.hidden) return;
    this.running = true;
    this.lastTime = performance.now();
    this._loop(this.lastTime);
  }

  /* 停止动画 */
  stop() {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /* 主循环 */
  _loop = (now) => {
    if (!this.running) return;

    const dt = now - this.lastTime;
    this.lastTime = now;

    // reduced motion：降低帧率
    if (this.reducedMotion) {
      this.frameAccumulator += dt;
      if (this.frameAccumulator >= this.reducedFrameInterval) {
        this.frameAccumulator %= this.reducedFrameInterval;
        this._update(this.reducedFrameInterval);
        this._draw();
      }
    } else {
      this._update(dt);
      this._draw();
    }

    this.rafId = requestAnimationFrame(this._loop);
  };

  /* 更新状态 */
  _update(dt) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        cell.nextChangeAt -= dt;

        // 到时间了，换字符 + 闪一下
        if (cell.nextChangeAt <= 0) {
          cell.char = randChar();
          cell.baseOpacity = rand(CONFIG.opacityMin, CONFIG.opacityMax);
          cell.flashStart = performance.now();
          cell.nextChangeAt = rand(CONFIG.changeIntervalMin, CONFIG.changeIntervalMax);
        }

        // 计算当前透明度（基础值 + 高亮衰减）
        const elapsed = performance.now() - cell.flashStart;
        if (elapsed < CONFIG.flashDuration) {
          const t = elapsed / CONFIG.flashDuration;
          cell.currentOpacity = cell.baseOpacity + (CONFIG.flashOpacity - cell.baseOpacity) * (1 - t);
        } else {
          cell.currentOpacity = cell.baseOpacity;
        }
      }
    }
  }

  /* 绘制 */
  _draw() {
    const ctx = this.ctx;
    const w = this.canvas.width / (window.devicePixelRatio || 1);
    const h = this.canvas.height / (window.devicePixelRatio || 1);

    // 半透明清空，制造微弱拖影（可选，值小一点更细腻）
    // 先全清空，保证背景干净
    ctx.clearRect(0, 0, w, h);

    ctx.font = `${this.fontSize}px ${CONFIG.fontFamily}`;
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#FFFFFF';

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        if (cell.currentOpacity < 0.01) continue;

        ctx.globalAlpha = cell.currentOpacity;
        ctx.fillText(
          cell.char,
          c * this.colWidth,
          r * this.rowHeight
        );
      }
    }

    ctx.globalAlpha = 1;

    // 边缘渐隐（上下左右 10% 区域淡出）
    const edgeSize = Math.min(w, h) * 0.08;
    const gradTop = ctx.createLinearGradient(0, 0, 0, edgeSize);
    gradTop.addColorStop(0, 'rgba(0,0,0,0.6)');
    gradTop.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradTop;
    ctx.fillRect(0, 0, w, edgeSize);

    const gradBottom = ctx.createLinearGradient(0, h - edgeSize, 0, h);
    gradBottom.addColorStop(0, 'rgba(0,0,0,0)');
    gradBottom.addColorStop(1, 'rgba(0,0,0,0.6)');
    ctx.fillStyle = gradBottom;
    ctx.fillRect(0, h - edgeSize, w, edgeSize);
  }
}

/* ===== 对外初始化 ===== */
export function initCharMatrix() {
  const canvas = document.getElementById('charMatrix');
  if (!canvas) return;

  const matrix = new CharMatrix(canvas);
  matrix.init();

  return matrix;
}

/* 自动初始化（如果此脚本被直接引入页面） */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCharMatrix);
} else {
  initCharMatrix();
}
