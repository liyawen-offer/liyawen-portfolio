(() => {
  'use strict';
  const host = document.getElementById('vibe-projects');
  if (!host) return;
  const projects = Array.isArray(window.VIBE_PROJECTS) ? window.VIBE_PROJECTS : [];
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const safeUrl = value => { if (!value) return null; try { const u = new URL(value, document.baseURI); return ['http:', 'https:', 'file:'].includes(u.protocol) ? u.href : null; } catch { return null; } };
  const external = (url, text, cls) => { const a = el('a', cls, text); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; return a; };
  function preview(project) {
    const visual = el('div', 'vibe-visual');
    const chrome = el('div', 'vibe-browser');
    const dots = el('span', 'vibe-browser-dots', '● ● ●'); dots.setAttribute('aria-hidden', 'true');
    chrome.append(dots, el('span', '', project.subtitle || project.title), el('span', '', 'WEB / PROTOTYPE'));
    visual.append(chrome);
    const fallback = () => {
      const canvas = el('div', 'vibe-canvas');
      canvas.append(el('p', 'eyebrow', 'PRODUCT / OVERVIEW'), el('p', 'vibe-preview-title', project.title));
      const features = el('div', 'vibe-preview-features');
      (project.features || []).forEach((f, i) => { const item = el('div'); item.append(el('span', 'vibe-feature-number', String(i + 1).padStart(2, '0')), el('strong', '', f.title), el('small', '', f.label)); features.append(item); });
      canvas.append(features, el('p', 'vibe-preview-caption', '功能结构预览 · 非产品截图')); return canvas;
    };
    const src = safeUrl(project.cover?.src);
    if (src) { const img = el('img', 'vibe-cover'); img.src = src; img.alt = project.cover.alt || project.title + '项目预览'; img.loading = 'lazy'; img.decoding = 'async'; if (project.cover.width && project.cover.height) { img.width = project.cover.width; img.height = project.cover.height; } img.addEventListener('error', () => img.replaceWith(fallback()), {once: true}); visual.append(img); }
    else visual.append(fallback());
    return visual;
  }
  projects.forEach((p, index) => {
    const card = el('article', 'vibe-card'); card.id = 'vibe-' + (p.id || index + 1); card.hidden = index >= 3;
    const body = el('div', 'vibe-body');
    const meta = el('div', 'vibe-meta'); if (p.status) meta.append(el('span', 'vibe-status', p.status)); if (p.year) meta.append(el('span', '', p.year));
    body.append(meta, el('h3', '', p.title), el('p', 'vibe-subtitle', p.subtitle), el('p', 'vibe-description', p.description));
    const tags = el('ul', 'vibe-tags'); (p.tags || []).forEach(t => tags.append(el('li', '', t))); body.append(tags);
    const actions = el('div', 'vibe-actions'); const url = safeUrl(p.url), details = safeUrl(p.detailsUrl);
    if (url) { const link = external(url, '体验项目 / Live Demo ↗', 'button primary'); link.setAttribute('aria-label', '体验' + p.title + '（新标签页打开）'); actions.append(link); }
    if (details) actions.append(external(details, '项目详情 ↗', 'text-link'));
    body.append(actions); card.append(preview(p), body); host.append(card);
  });
  if (!projects.length) host.append(el('p', 'section-note', '新的作品正在准备中。'));
  const controls = document.getElementById('vibe-controls'), toggle = document.getElementById('vibe-toggle'), count = document.getElementById('vibe-count');
  controls.hidden = projects.length <= 3;
  let expanded = false;
  const update = () => { [...host.children].forEach((c, i) => c.hidden = !expanded && i >= 3); toggle.setAttribute('aria-expanded', String(expanded)); toggle.textContent = expanded ? '收起更多项目 −' : '查看全部 ' + projects.length + ' 个项目 ＋'; count.textContent = '展示 ' + (expanded ? projects.length : Math.min(3, projects.length)) + ' / ' + projects.length + ' 个项目'; };
  toggle.addEventListener('click', () => { expanded = !expanded; update(); if (!expanded) toggle.focus(); }); update();
})();
