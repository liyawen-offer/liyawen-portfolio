(() => {
  'use strict';
  const profile = window.PROFILE;
  if (!profile) return;
  const el = (tag, className, value) => { const node = document.createElement(tag); if(className) node.className = className; if(value !== undefined) node.textContent = value; return node; };
  document.querySelectorAll('[data-profile]').forEach(node => node.textContent = profile[node.dataset.profile] || '待补充');
  document.title = `${profile.name} · AI 产品经理作品集`;
  document.getElementById('year').textContent = new Date().getFullYear();
  const safeUrl = value => { try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; } catch { return null; } };
  const covers = {"ai":"<div class=\"cover-heading\"><span>AGENT / SERVICE DESIGN</span><span class=\"cover-index\">01</span></div><div class=\"agent-diagram\"><div class=\"intent-line\"><span class=\"diagram-label\">用户意图</span><strong>从「问一个问题」<br>到「完成一件事」</strong></div><div class=\"agent-path\"><div><span>01</span><b>意图承接</b><small>理解诉求</small></div><i aria-hidden=\"true\">→</i><div><span>02</span><b>状态判断</b><small>结合业务状态</small></div><i aria-hidden=\"true\">→</i><div><span>03</span><b>方案推荐</b><small>匹配可行选项</small></div></div><div class=\"action-bar\"><span>04 / 卡片化操作</span><b>连接具体业务任务</b><span aria-hidden=\"true\">↗</span></div><div class=\"task-labels\"><span>查账</span><span>还款</span><span>设置修改</span><span>锁定 / 关闭</span></div></div><div class=\"cover-caption\"><span>方案结构示意</span><span>INTENT → ACTION</span></div>","workflow":"<div class=\"cover-heading\"><span>EXPERIENCE / DECISION RULES</span><span class=\"cover-index\">02</span></div><div class=\"rule-diagram\"><p>把体验反馈，<br>转化为决策规则。</p><div class=\"rule-inputs\"><span>曝光</span><span>点击</span><span>负反馈</span></div><div class=\"rule-line\"><span>行为计分</span><i aria-hidden=\"true\">→</i><span>保留 / 退场</span></div></div><div class=\"cover-caption\"><span>资源位治理逻辑示意</span><span>MEASURE → REFINE</span></div>","experiment":"<div class=\"cover-heading\"><span>GROWTH / CONVERSION</span><span class=\"cover-index\">03</span></div><div class=\"growth-diagram\"><p>从参与，到转化。</p><div class=\"growth-steps\"><div><span>01</span><b>感知</b><small>清晰表达利益点</small></div><div><span>02</span><b>互动</b><small>分享盲盒领券</small></div><div><span>03</span><b>购买</b><small>观察交易转化</small></div></div></div><div class=\"cover-caption\"><span>增长链路示意</span><span>ENGAGE → CONVERT</span></div>"};
  const dialog = document.getElementById('case-dialog');
  let lastTrigger;
  function showCase(project, trigger) {
    lastTrigger = trigger;
    document.getElementById('case-status').textContent = project.placeholder ? '待补充案例 · 以下为内容填写提纲' : project.category;
    document.getElementById('case-title').textContent = project.title;
    document.getElementById('case-summary').textContent = project.summary;
    const details = document.getElementById('case-details'); details.replaceChildren();
    [['问题与背景', project.problem], ['思路与取舍', project.approach], ['我的贡献', project.contribution], ['结果与复盘', project.result]].forEach(([title, content]) => { const section = el('section'); section.append(el('h3', '', title), el('p', '', content || '待补充')); details.append(section); });
    if(project.note) { details.append(el('p', 'case-note', project.note)); }
    const link = document.getElementById('case-link'), url = safeUrl(project.url);
    link.hidden = !url; link.removeAttribute('href'); if(url) { link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    dialog.showModal(); document.body.style.overflow = 'hidden';
    document.getElementById('close-dialog').focus();
  }
  function closeCase() { dialog.close(); }
  document.getElementById('close-dialog').addEventListener('click', closeCase);
  dialog.addEventListener('click', event => { const r = dialog.getBoundingClientRect(); if(event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) closeCase(); });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; lastTrigger?.focus(); });
  const projects = Array.isArray(profile.projects) ? profile.projects : [];
  document.getElementById('draft-note').hidden = !projects.some(project => project.placeholder);
  projects.forEach((project, index) => {
    const card = el('article', 'work-card' + (index === 0 ? ' featured' : ''));
    card.id = 'project-' + String(index + 1).padStart(2, '0');
    const visual = el('div', 'work-visual cover-' + project.type);
    visual.innerHTML = covers[project.type] || '';
    const indexLink = el('a', 'index-item'); indexLink.href = '#' + card.id;
    indexLink.append(el('span', 'index-number', String(index + 1).padStart(2, '0')), el('strong', '', project.title), el('span', 'index-arrow', '↗'));
    document.getElementById('project-index').append(indexLink);
    const body = el('div', 'work-body'); body.append(el('p', 'work-category', project.category), el('h3', '', project.title), el('p', 'project-summary', project.summary));
    const outcome = el('div', 'project-outcome'); outcome.append(el('strong', 'project-metric', project.metric), el('p', 'project-metric-label', project.metricLabel)); body.append(outcome);
    const tags = el('div', 'tags'); (project.tags || []).forEach(tag => tags.append(el('span', 'tag', tag))); body.append(tags);
    const button = el('button', 'case-button', project.placeholder ? '查看案例结构' : '查看案例详情'); button.type = 'button'; button.setAttribute('aria-label', `${button.textContent}：${project.title}`); button.append(el('span', '', '↗')); button.addEventListener('click', () => showCase(project, button));
    body.append(button, el('p', 'project-period', project.period)); card.append(visual, body); document.getElementById('work-grid').append(card);
  });
  if(!projects.length) document.getElementById('work-grid').append(el('p','draft-note','作品即将更新。'));
  (profile.experiences || []).forEach(experience => { const article = el('article'); article.append(el('p', 'period', experience.period), el('h3', '', experience.title), el('p', 'organization', experience.organization), el('p', 'description', experience.description)); document.getElementById('timeline').append(article); });
  const contact = document.getElementById('contact-content');
  const email = (profile.email || '').trim(), wechat = (profile.wechat || '').trim();
  const phone = (profile.phone || '').replace(/[^+0-9]/g, '');
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/[\r\n]/.test(email);
  let toastTimer;
  function toast(message) { const node = document.getElementById('toast'); node.textContent = message; node.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => node.classList.remove('visible'), 3500); }
  if(validEmail || wechat || phone) {
    contact.className = 'contact-buttons';
    if(validEmail) { const link = el('a', 'button primary', '发送邮件 ↗'); link.href = `mailto:${encodeURIComponent(email)}`; contact.append(link); }
    if(phone) { const phoneLink = el('a', 'button secondary', '电话联系'); phoneLink.href = 'tel:' + phone; contact.append(phoneLink); }
    if(wechat) { const button = el('button', 'button secondary', '复制微信号'); button.addEventListener('click', async () => { try { await navigator.clipboard.writeText(wechat); toast('微信号已复制'); } catch { toast(`微信号：${wechat}`); } }); contact.append(button); }
  } else contact.append(el('div', 'contact-pending', '邮箱 / 微信 · 待补充'));
  const header = document.querySelector('.header');
  const menu = document.querySelector('.menu-toggle');
  const closeMenu = () => { header.classList.remove('menu-open'); menu.setAttribute('aria-expanded', 'false'); };
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); header.classList.toggle('menu-open', open); });
  document.querySelectorAll('#main-nav a').forEach(a => a.addEventListener('click', closeMenu));
  header.addEventListener('keydown', event => { if(event.key === 'Escape') { closeMenu(); menu.focus(); } });
  document.addEventListener('click', event => { if(!header.contains(event.target)) closeMenu(); });
  window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
  if('IntersectionObserver' in window) { const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if(entry.isIntersecting) document.querySelectorAll('.header nav a').forEach(a => { const active = a.hash === '#' + entry.target.id; a.classList.toggle('active', active); if(active) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); }); }); }, { rootMargin: '-10% 0px -60% 0px', threshold: 0 }); document.querySelectorAll('main section[id]').forEach(section => observer.observe(section)); }
})();
