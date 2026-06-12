/* =============================================================
   Shail's Java Mastery — shared engine
   All behavior lives here. Content lives in /content/*.js.

   Authoring model
   ---------------
   Learning topics use topic({...}) with the fixed 11 parts:
     concept, why, internal, useCases, code, mistakes,
     bestPractices, interview, exercises, challenges, summary
   Each part value is Markdown. Missing parts show a "coming soon"
   placeholder unless the topic is marked deep:true.

   Section pages (projects/interview/plan) use lesson({...}) with a
   custom sections array; each section body is Markdown via md().
   ============================================================= */

/* ---------- registries ---------- */
window.COURSE = window.COURSE || [];     // 14 learning modules
window.SECTIONS = window.SECTIONS || []; // projects / interview / plan
window.PLAN_WEEKS = window.PLAN_WEEKS || []; // 15-week schedule
function registerModule(m)  { window.COURSE.push(m); }
function registerSection(m) { window.SECTIONS.push(m); }

/* =============================================================
   Read Tracker — persists "mark as read" per lesson
   Key format: sjm-read-{moduleId}-{lessonId}
   ============================================================= */
function readKey(moduleId, lessonId) { return 'sjm-read-' + moduleId + '-' + lessonId; }
function isRead(moduleId, lessonId) {
  try { return !!localStorage.getItem(readKey(moduleId, lessonId)); } catch(e) { return false; }
}
function setRead(moduleId, lessonId, val) {
  try {
    if (val) localStorage.setItem(readKey(moduleId, lessonId), '1');
    else localStorage.removeItem(readKey(moduleId, lessonId));
  } catch(e) {}
}
function toggleRead(btn) {
  const {module: mod, lesson} = btn.dataset;
  const nowRead = !isRead(mod, lesson);
  setRead(mod, lesson, nowRead);
  btn.classList.toggle('is-read', nowRead);
  btn.textContent = nowRead ? '✓ Marked as Complete' : 'Mark as Complete';
  btn.nextElementSibling.textContent = nowRead
    ? 'Progress tracked on your 15-Week Plan' : 'Track your progress on the 15-Week Plan';
}
function getCollection(id)  { return window.COURSE.concat(window.SECTIONS).find(c => c.id === id); }

/* ---------- the 11-part learning template ---------- */
const LEARNING_PARTS = [
  ['concept',       'Concept Explanation'],
  ['why',           'Why It Is Used'],
  ['internal',      'Internal Working'],
  ['useCases',      'Real-World Use Cases'],
  ['code',          'Code Examples'],
  ['mistakes',      'Common Mistakes'],
  ['bestPractices', 'Best Practices'],
  ['interview',     'Interview Questions'],
  ['exercises',     'Hands-on Exercises'],
  ['challenges',    'Challenge Problems'],
  ['summary',       'Summary Notes'],
];

/* Section heading labels: the 11 standard parts plus a few custom ones
   used by topics where a more specific heading reads better. Any key not
   listed falls back to a humanised version of the key itself. */
const PART_LABELS = Object.assign(
  Object.fromEntries(LEARNING_PARTS),
  {
    designGoals:           'Design Goals',
    milestones:            'Milestone Releases',
    internalModel:         'Internal Working',
    checkYourSetup:        'Check Your Setup',
    whyThisDesign:         'Why This Design',
    classLoaderAndMemory:  'Class Loader & Memory Model',
    practicalImplications: 'Practical Implications',
    twoPhaseProcess:       'The Two-Phase Process',
    syntaxRules:           'Syntax Rules',
    anatomy:               'Anatomy of a Program',
    rules:                 'Rules & Mechanics',
    comparison:            'Comparison',
  }
);
/* Keys that are metadata, not renderable content sections. */
const TOPIC_META = new Set([
  'id', 'chapter', 'title', 'subtitle', 'readTime', 'level',
  'deep', 'objectives', 'note', 'icon'
]);
function _humanizeKey(k) {
  return k.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
          .replace(/[_-]+/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
}

/* Build a learning lesson. Content parts render in the order the author
   declared them (so custom sections appear in place), with the standard
   11-part labels by default. Non-deep stubs still show "coming soon"
   placeholders for any standard part that's missing. */
function topic(t) {
  const sections = [];
  Object.keys(t).forEach(key => {
    if (TOPIC_META.has(key)) return;
    const val = t[key];
    if (val == null || val === '') return;
    sections.push({ id: key, heading: PART_LABELS[key] || _humanizeKey(key),
      level: 2, body: md(val) });
  });
  if (!t.deep) {
    LEARNING_PARTS.forEach(([key, label]) => {
      if (t[key] == null || t[key] === '') {
        sections.push({ id: key, heading: label, level: 2,
          body: `<p class="placeholder">📝 <em>${label}</em> — content coming soon.</p>` });
      }
    });
  }
  return {
    id: t.id, title: t.title, chapter: t.chapter, subtitle: t.subtitle,
    readTime: t.readTime, level: t.level, objectives: t.objectives,
    sections, note: false
  };
}

/* Build a generic lesson; each section may use `md` (Markdown) or `body` (HTML). */
function lesson(l) {
  const sections = (l.sections || []).map(s => ({
    id: s.id, heading: s.heading, level: s.level || 2,
    body: s.body != null ? s.body : md(s.md || '')
  }));
  return { ...l, sections };
}

/* =============================================================
   Question Bank (Interview Prep)
   ---------------------------------------------------------------
   qbank({ id, chapter, title, ..., categories:[
     { id, heading, questions:[ { q, a }, ... ] }, ...
   ]})
   Each category is a section (its heading also feeds the right-hand
   "In this article" panel). Questions are numbered continuously
   within the chapter (each chapter restarts at 1 → independent sets).
   Rendering + interactivity (show answer, favourite, favourites-only
   filter) is handled by renderQbankBody() and the toggle helpers.
   ============================================================= */
function qbank(l) {
  let n = 0;
  const categories = (l.categories || []).map(cat => ({
    id: cat.id,
    heading: cat.heading,
    questions: (cat.questions || []).map(q => ({ n: ++n, q: q.q, a: q.a }))
  }));
  // sections drive the right-hand TOC / scroll-spy (one entry per category)
  const sections = categories.map(c => ({ id: c.id, heading: c.heading }));
  return { ...l, qbank: true, categories, sections };
}

/* ---- Per-question state: favourite + read, each a set of stable ids ---- */
const FAVQ_KEY = 'sjm-fav-q';
const READQ_KEY = 'sjm-read-q';
function _getIdSet(key) {
  try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')); }
  catch (e) { return new Set(); }
}
function _saveIdSet(key, set) {
  try { localStorage.setItem(key, JSON.stringify([...set])); } catch (e) {}
}
function getFavQs()  { return _getIdSet(FAVQ_KEY); }
function getReadQs() { return _getIdSet(READQ_KEY); }

/* ---- Build the interactive body for a question-bank lesson ---- */
function renderQbankBody(les) {
  const favs = getFavQs(), reads = getReadQs();
  const lid = les.id;
  let total = 0, totalFav = 0, totalRead = 0, cats = '';

  les.categories.forEach(cat => {
    let items = '';
    cat.questions.forEach(q => {
      const qid = 'interview::' + lid + '::' + q.n;
      const fav = favs.has(qid), read = reads.has(qid);
      total++; if (fav) totalFav++; if (read) totalRead++;
      items += `<div class="qa-item${fav ? ' is-fav' : ''}${read ? ' is-read' : ''}" data-qid="${qid}">`
        + `<div class="qa-q">`
        +   `<button class="qa-num" type="button" aria-expanded="false" `
        +     `aria-label="Show or hide answer for question ${q.n}" title="Show / hide answer" `
        +     `onclick="toggleQAnswer(this)">${q.n}</button>`
        +   `<span class="qa-text">${mdInline(q.q)}`
        +     `<span class="qa-flag qa-flag-fav" title="Favourited">★</span>`
        +     `<span class="qa-flag qa-flag-read" title="Read">✓</span></span>`
        + `</div>`
        + `<div class="qa-a" hidden>`
        +   `<div class="qa-a-body">${md(q.a)}</div>`
        +   `<div class="qa-actions">`
        +     `<button class="qa-icon qa-fav${fav ? ' is-on' : ''}" type="button" aria-pressed="${fav}" `
        +       `title="${fav ? 'Favourited' : 'Favourite'}" onclick="toggleQFav(this)">${fav ? '★' : '☆'}</button>`
        +     `<button class="qa-icon qa-read${read ? ' is-on' : ''}" type="button" aria-pressed="${read}" `
        +       `title="${read ? 'Marked as read' : 'Mark as read'}" onclick="toggleQRead(this)">✓</button>`
        +   `</div>`
        + `</div>`
        + `</div>`;
    });
    cats += `<section class="qa-cat" data-cat="${cat.id}">`
      + `<h2 id="${cat.id}">${cat.heading}`
      +   `<span class="qa-cat-count">${cat.questions.length}</span></h2>`
      + `<div class="qa-list">${items}</div>`
      + `</section>`;
  });

  const bar = `<div class="qbank-bar">`
    + `<div class="qbank-bar-info"><span class="qbank-total">${total}</span> questions`
    +   ` · <span class="qbank-fav-count">${totalFav}</span> favourited`
    +   ` · <span class="qbank-read-count">${totalRead}</span> read</div>`
    + `<div class="qbank-controls">`
    +   `<button class="qbank-allbtn" type="button" onclick="toggleAllAnswers(this)">Show all answers</button>`
    +   `<button class="qbank-filter" type="button" data-filter="fav" aria-pressed="false" `
    +     `title="Show only questions you've favourited" onclick="toggleQFilter(this)"><span class="qf-ic">☆</span> Show Fav</button>`
    +   `<button class="qbank-filter" type="button" data-filter="hideread" aria-pressed="false" `
    +     `title="Hide questions you've marked as read" onclick="toggleQFilter(this)"><span class="qf-ic">✓</span> Hide Read</button>`
    + `</div></div>`;

  const empty = `<p class="qbank-empty" hidden></p>`;

  return `<div class="qbank" data-lesson="${lid}">${bar}${empty}${cats}</div>`;
}

/* ---- Show / hide one answer (the question-number badge is the toggle) ---- */
function toggleQAnswer(btn) {
  const item = btn.closest('.qa-item');
  const ans = item.querySelector('.qa-a');
  const open = ans.hasAttribute('hidden');   // currently hidden → opening
  if (open) { ans.removeAttribute('hidden'); item.classList.add('open'); }
  else { ans.setAttribute('hidden', ''); item.classList.remove('open'); }
  const num = item.querySelector('.qa-num');
  if (num) num.setAttribute('aria-expanded', open ? 'true' : 'false');
}

/* ---- Show / hide ALL answers; the button label tracks the last action ---- */
function toggleAllAnswers(btn) {
  const wrap = btn.closest('.qbank');
  const open = !wrap.classList.contains('all-open');
  wrap.classList.toggle('all-open', open);
  wrap.querySelectorAll('.qa-item').forEach(item => {
    const ans = item.querySelector('.qa-a');
    const num = item.querySelector('.qa-num');
    if (open) { ans.removeAttribute('hidden'); item.classList.add('open'); }
    else { ans.setAttribute('hidden', ''); item.classList.remove('open'); }
    if (num) num.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  btn.textContent = open ? 'Hide all answers' : 'Show all answers';
}

/* ---- Toggle one question's favourite / read state (icon buttons) ---- */
function _toggleQState(btn, kind) {
  const cfg = kind === 'fav'
    ? { key: FAVQ_KEY, cls: 'is-fav', on: '★', off: '☆', onTitle: 'Favourited', offTitle: 'Favourite' }
    : { key: READQ_KEY, cls: 'is-read', on: '✓', off: '✓', onTitle: 'Marked as read', offTitle: 'Mark as read' };
  const item = btn.closest('.qa-item');
  const qid = item.dataset.qid;
  const set = _getIdSet(cfg.key);
  const on = !set.has(qid);
  if (on) set.add(qid); else set.delete(qid);
  _saveIdSet(cfg.key, set);
  item.classList.toggle(cfg.cls, on);
  btn.textContent = on ? cfg.on : cfg.off;
  btn.classList.toggle('is-on', on);
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  btn.title = on ? cfg.onTitle : cfg.offTitle;
  const wrap = item.closest('.qbank');
  if (wrap) {
    updateQCounts(wrap);
    if (wrap.classList.contains('filter-fav') || wrap.classList.contains('filter-hideread')) applyQFilter(wrap);
  }
}
function toggleQFav(btn)  { _toggleQState(btn, 'fav'); }
function toggleQRead(btn) { _toggleQState(btn, 'read'); }

/* ---- Top-bar filters: "Show Fav" (only favourites) + "Hide Read"
   (drop anything marked read). Combinable — together they show the
   questions you flagged as important that you haven't finished yet. ---- */
function toggleQFilter(btn) {
  const wrap = btn.closest('.qbank');
  const on = btn.classList.toggle('active');
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  wrap.classList.toggle('filter-' + btn.dataset.filter, on);
  applyQFilter(wrap);
}

/* ---- Apply active filters: hide non-matching items + empty cats + empty msg ---- */
function applyQFilter(wrap) {
  const favOnly = wrap.classList.contains('filter-fav');
  const hideRead = wrap.classList.contains('filter-hideread');
  let totalVisible = 0;
  wrap.querySelectorAll('.qa-cat').forEach(cat => {
    let shown = 0;
    cat.querySelectorAll('.qa-item').forEach(item => {
      const vis = (!favOnly || item.classList.contains('is-fav'))
               && (!hideRead || !item.classList.contains('is-read'));
      item.hidden = !vis;
      if (vis) shown++;
    });
    cat.hidden = (favOnly || hideRead) && shown === 0;
    totalVisible += shown;
  });
  const empty = wrap.querySelector('.qbank-empty');
  if (empty) {
    const showEmpty = (favOnly || hideRead) && totalVisible === 0;
    empty.hidden = !showEmpty;
    if (showEmpty) empty.innerHTML = _qbankEmptyMsg(favOnly, hideRead);
  }
}
function _qbankEmptyMsg(favOnly, hideRead) {
  if (favOnly && hideRead)
    return `Nothing left here — every favourite is marked read. Nicely done!`;
  if (favOnly)
    return `You haven't marked any favourite yet. Open a question and tap <strong>☆</strong> to flag the important ones.`;
  return `Every question here is marked as read — nothing left to review.`;
}

/* ---- Keep the bar's "N favourited / N read" counters up to date ---- */
function updateQCounts(wrap) {
  const f = wrap.querySelector('.qbank-fav-count');
  const r = wrap.querySelector('.qbank-read-count');
  if (f) f.textContent = wrap.querySelectorAll('.qa-item.is-fav').length;
  if (r) r.textContent = wrap.querySelectorAll('.qa-item.is-read').length;
}

/* =============================================================
   Minimal Markdown renderer (block + inline subset)
   Supports: fenced code, headings, lists, tables, blockquotes,
   hr, bold, italic, inline code, links, paragraphs.
   ============================================================= */
function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function mdInline(t) {
  t = esc(t);
  t = t.replace(/`([^`]+)`/g, (m, c) => '<code>' + c + '</code>');
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  t = t.replace(/\\\|/g, '|');   // markdown-style escaped pipe -> literal |
  return t;
}
function md(src) {
  if (src == null) return '';
  src = String(src).replace(/\r\n/g, '\n');

  // pull out fenced code blocks
  const blocks = [];
  src = src.replace(/```(\w*)\n([\s\S]*?)```/g, (m, lang, code) => {
    blocks.push('<pre><code>' + esc(code.replace(/\n$/, '')) + '</code></pre>');
    return ' B' + (blocks.length - 1) + ' ';
  });

  const lines = src.split('\n');
  let out = '', i = 0;
  const isBlank = s => /^\s*$/.test(s);

  while (i < lines.length) {
    let line = lines[i];

    if (isBlank(line)) { i++; continue; }

    let bm = line.match(/^ B(\d+) $/);
    if (bm) { out += blocks[+bm[1]]; i++; continue; }

    if (/^#{1,6}\s/.test(line)) {
      const h = line.match(/^#+/)[0].length;
      const tag = 'h' + Math.min(6, h + 3);
      out += `<${tag}>${mdInline(line.replace(/^#+\s/, ''))}</${tag}>`;
      i++; continue;
    }

    if (/^(\-\-\-|\*\*\*)\s*$/.test(line)) { out += '<hr>'; i++; continue; }

    // table
    if (/^\|/.test(line) && i + 1 < lines.length && /^\|?[\s:|-]+\|/.test(lines[i + 1])) {
      // split on unescaped pipes; a backslash-escaped \| is a literal pipe in the cell
      const cells = r => {
        r = r.replace(/^\|/, '').replace(/\|$/, '');
        const out = []; let cur = '';
        for (let k = 0; k < r.length; k++) {
          if (r[k] === '\\' && r[k + 1] === '|') { cur += '|'; k++; }
          else if (r[k] === '|') { out.push(cur.trim()); cur = ''; }
          else cur += r[k];
        }
        out.push(cur.trim());
        return out;
      };
      const head = cells(line);
      i += 2;
      let rows = '';
      while (i < lines.length && /^\|/.test(lines[i])) {
        rows += '<tr>' + cells(lines[i]).map(c => `<td>${mdInline(c)}</td>`).join('') + '</tr>';
        i++;
      }
      out += '<table><thead><tr>' + head.map(c => `<th>${mdInline(c)}</th>`).join('') +
             '</tr></thead><tbody>' + rows + '</tbody></table>';
      continue;
    }

    // blockquote
    if (/^>\s?/.test(line)) {
      let buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, '')); i++; }
      out += '<blockquote>' + md(buf.join('\n')) + '</blockquote>';
      continue;
    }

    // unordered list
    if (/^\s*[-*]\s+/.test(line)) {
      let items = '';
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items += '<li>' + mdInline(lines[i].replace(/^\s*[-*]\s+/, '')) + '</li>'; i++;
      }
      out += '<ul>' + items + '</ul>';
      continue;
    }

    // ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      let items = '';
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items += '<li>' + mdInline(lines[i].replace(/^\s*\d+\.\s+/, '')) + '</li>'; i++;
      }
      out += '<ol>' + items + '</ol>';
      continue;
    }

    // paragraph
    let para = [];
    while (i < lines.length && !isBlank(lines[i]) &&
           !/^(#{1,6}\s|>\s?|\s*[-*]\s+|\s*\d+\.\s+|\|)/.test(lines[i]) &&
           !/^ B\d+ $/.test(lines[i]) &&
           !/^(\-\-\-|\*\*\*)\s*$/.test(lines[i])) {
      para.push(lines[i]); i++;
    }
    out += '<p>' + mdInline(para.join(' ')) + '</p>';
  }
  return out;
}

/* =============================================================
   Theme (Day | Auto | Night)
   ============================================================= */
function initTheme() {
  const root = document.documentElement;
  let pref = root.getAttribute('data-theme-pref') || 'auto';
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  function apply() {
    const dark = pref === 'dark' || (pref === 'auto' && mq.matches);
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    root.setAttribute('data-theme-pref', pref);
    document.querySelectorAll('.theme-toggle [data-theme-choice]').forEach(b =>
      b.classList.toggle('active', b.dataset.themeChoice === pref));
  }
  if (mq.addEventListener) mq.addEventListener('change', () => { if (pref === 'auto') apply(); });
  document.querySelectorAll('.theme-toggle [data-theme-choice]').forEach(b => {
    b.addEventListener('click', () => {
      pref = b.dataset.themeChoice;
      try { localStorage.setItem('sjm-theme', pref); } catch (e) {}
      apply();
    });
  });
  apply();
  applyModulesNavLink();
  initSearch();
  initTocLinks();
}

/* In-page TOC links (desktop "In this article" + mobile "On this page") should
   smooth-scroll to the section without changing the hash (the hash selects the
   lesson, so changing it would reload a different lesson). Delegated once. */
let _tocLinksWired = false;
function initTocLinks() {
  if (_tocLinksWired) return;
  _tocLinksWired = true;
  document.addEventListener('click', e => {
    const a = e.target.closest('aside.toc a[href^="#"], .page-toc-mobile a[href^="#"]');
    if (!a) return;
    const el = document.getElementById(a.getAttribute('href').slice(1));
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const det = a.closest('details'); if (det) det.open = false;
  });
}

/* "Modules" top-nav link → wherever the user last was in the modules.
   Persisted in localStorage; falls back to Module 1, section 1.1. */
function rememberLastModule(page, lessonId) {
  try {
    localStorage.setItem('sjm-last-module', page + (lessonId ? '#' + lessonId : ''));
  } catch (e) {}
  applyModulesNavLink();
}
function applyModulesNavLink() {
  let target = 'module-java-fundamentals.html';   /* default = section 1.1 */
  try { target = localStorage.getItem('sjm-last-module') || target; } catch (e) {}
  document.querySelectorAll('[data-nav-modules]').forEach(a => a.setAttribute('href', target));
}

/* =============================================================
   Sidebar — nested, animated, read-aware
   ============================================================= */

/* ---- One lesson row (top-level heading only; the lesson's own
   sub-headings live in the right-hand "In this article" panel) ---- */
function _navLessonRow(col, les, isAct, ctxLesson) {
  const wasRead = isRead(col.id, les.id);
  return `<li class="nav-les-li${isAct ? ' active' : ''}${wasRead ? ' read' : ''}">`
    + `<a href="${col.page}#${les.id}" class="nav-les-a${isAct ? ' active' : ''}${wasRead ? ' read' : ''}">`
    + (les.chapter ? `<span class="nav-ch">${les.chapter}</span>` : '')
    + `<span class="nav-les-name">${les.title}</span>`
    + (wasRead ? `<span class="nav-read-dot" title="Marked as read">✓</span>` : '')
    + `</a></li>`;
}

/* ---- Collapsible group for a section (Projects / Interview Prep) ---- */
function _navSectionGroup(col, icon, label, ctx) {
  if (!col) return '';
  const open = ctx.active === col.id;
  let h = `<div class="nav-mod nav-mod--section${open ? '' : ' collapsed'}">`
    + `<button class="nav-mod-head" type="button">`
    + `<span class="nav-chev"></span>`
    + `<span class="nav-top-ic">${icon}</span>`
    + `<span class="nav-mod-name">${label}</span>`
    + `</button><ul class="nav-les-list">`;
  col.lessons.forEach(les => {
    h += _navLessonRow(col, les, open && les.id === ctx.lessonId, ctx.lesson);
  });
  return h + '</ul></div>';
}

/* ---- Collapsible group for one learning module ---- */
function _navModuleGroup(mod, mi, ctx) {
  const isCur = ctx.active === 'module' && mod.id === ctx.moduleId;
  let h = `<div class="nav-mod${isCur ? '' : ' collapsed'}">`
    + `<button class="nav-mod-head" type="button">`
    + `<span class="nav-chev"></span>`
    + `<span class="nav-mod-num">${String(mi + 1).padStart(2, '0')}</span>`
    + `<span class="nav-mod-name">${mod.module}</span>`
    + `</button><ul class="nav-les-list">`;
  mod.lessons.forEach(les => {
    h += _navLessonRow(mod, les, isCur && les.id === ctx.lessonId, ctx.lesson);
  });
  return h + '</ul></div>';
}

/* Unified sidebar — identical order on every page:
   Home · 15-Week Plan · Projects · Interview Prep · Learning Modules */
function buildSidebar(ctx) {
  ctx = ctx || {};
  const nav = document.getElementById('moduleNav');
  if (!nav) return;
  const projects  = window.SECTIONS.find(s => s.id === 'projects');
  const interview = window.SECTIONS.find(s => s.id === 'interview');

  let html = '';
  html += `<a class="nav-home" href="index.html"><span class="nav-top-ic">🏠</span> Home</a>`;
  html += `<a class="nav-top-link${ctx.active === 'plan' ? ' active' : ''}" href="study-plan.html">`
        + `<span class="nav-top-ic">🗓️</span><span class="nav-top-name">15-Week Plan</span></a>`;
  html += _navSectionGroup(projects, '🏗️', 'Projects', ctx);
  html += _navSectionGroup(interview, '🎯', 'Interview Prep', ctx);
  html += `<div class="nav-sect-label nav-sect-label--gap"><span class="nav-top-ic">📚</span> Learning Modules</div>`;
  window.COURSE.forEach((mod, mi) => { html += _navModuleGroup(mod, mi, ctx); });

  nav.innerHTML = html;
  _attachModuleToggles(nav);
}

/* Thin wrappers kept for existing call sites — both delegate to the
   unified buildSidebar() so every page shares the same nav order. */
function buildSidebarModules(currentModuleId, currentLessonId, currentLesson) {
  buildSidebar({ active: 'module', moduleId: currentModuleId,
                 lessonId: currentLessonId, lesson: currentLesson });
}

function buildSidebarSection(collection, currentLessonId, currentLesson) {
  buildSidebar({ active: collection.id,
                 lessonId: currentLessonId, lesson: currentLesson });
}

/* Attach click-to-toggle handlers after innerHTML is set */
function _attachModuleToggles(nav) {
  nav.querySelectorAll('.nav-mod-head').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.nav-mod').classList.toggle('collapsed');
    });
  });
}

/* =============================================================
   Render one lesson
   ============================================================= */
function renderLesson(les, collection) {
  const content = document.getElementById('content');
  const list = collection.lessons;
  const idx = list.findIndex(l => l.id === les.id);

  let html = `
    <div class="breadcrumb">
      <a href="index.html">Java Mastery</a><span class="sep">›</span>
      <a href="${collection.page}">${collection.module}</a><span class="sep">›</span>
      <span>${les.title}</span>
    </div>`;
  if (les.chapter) html += `<div class="chapter-eyebrow">Chapter ${les.chapter}</div>`;
  html += `<h1>${les.title}</h1>`;
  if (les.subtitle) html += `<p class="subtitle">${les.subtitle}</p>`;
  html += `<div class="article-meta">
      <span class="badge">📘 ${collection.module}</span>
      ${les.readTime ? `<span class="badge">⏱ ${les.readTime}</span>` : ''}
      ${les.level ? `<span class="badge">🎯 ${les.level}</span>` : ''}
    </div>`;

  /* Mobile-only "On this page" disclosure (the desktop TOC is hidden on small screens) */
  if (les.sections && les.sections.length) {
    html += `<details class="page-toc-mobile"><summary><span>📑 On this page</span><span class="ptm-chev">▾</span></summary><ul>` +
      les.sections.map(sec =>
        `<li class="${sec.level === 3 ? 'sub' : ''}"><a href="#${sec.id}" data-toc="${sec.id}">${sec.heading}</a></li>`
      ).join('') + `</ul></details>`;
  }

  if (les.objectives && les.objectives.length) {
    html += `<div class="objectives"><h4>Learning Objectives</h4><ul>` +
      les.objectives.map(o => `<li>${mdInline(o)}</li>`).join('') + `</ul></div>`;
  }

  if (les.qbank) {
    html += renderQbankBody(les);
  } else {
    les.sections.forEach(sec => {
      const tag = sec.level === 3 ? 'h3' : 'h2';
      html += `<${tag} id="${sec.id}">${sec.heading}</${tag}>${sec.body || ''}`;
    });
  }

  if (les.note) html += `<div class="note"><strong>Note —</strong> ${les.note}</div>`;

  // Mark as Read bar (skip for plan page itself)
  if (collection.id !== 'plan') {
    const alreadyRead = isRead(collection.id, les.id);
    html += `<div class="mark-read-bar">
      <button class="mark-read-btn${alreadyRead ? ' is-read' : ''}"
              data-module="${collection.id}" data-lesson="${les.id}"
              onclick="toggleRead(this)">
        ${alreadyRead ? '✓ Marked as Complete' : 'Mark as Complete'}
      </button>
      <span class="read-hint">${alreadyRead ? 'Progress tracked on your 15-Week Plan' : 'Track your progress on the 15-Week Plan'}</span>
    </div>`;
  }

  const prev = list[idx - 1], next = list[idx + 1];
  html += `<div class="pager">
    ${prev ? `<a class="prev" href="${collection.page}#${prev.id}"><span class="dir">← Previous</span><span class="ttl">${prev.title}</span></a>` : `<a class="prev disabled"></a>`}
    ${next ? `<a class="next" href="${collection.page}#${next.id}"><span class="dir">Next →</span><span class="ttl">${next.title}</span></a>` : `<a class="next disabled"></a>`}
  </div>`;

  content.innerHTML = html;
  /* smooth fade-in on each lesson / subsection change */
  content.classList.remove('fade-in');
  void content.offsetWidth;            /* restart the animation */
  content.classList.add('fade-in');
  /* reset scroll for both the page (home/phones) and the #content
     scroll container (desktop app-shell), then refresh floating UI */
  window.scrollTo(0, 0);
  content.scrollTop = 0;
  buildPageToc(les);
  updateFloatingUI();
}

function buildPageToc(les) {
  const list = document.getElementById('tocList');
  if (!list) return;
  list.innerHTML = les.sections.map(sec =>
    `<li class="${sec.level === 3 ? 'sub' : ''}"><a href="#${sec.id}" data-toc="${sec.id}">${sec.heading}</a></li>`
  ).join('');
}

let _observer;
function setupScrollSpy() {
  if (_observer) _observer.disconnect();
  const headings = document.querySelectorAll('main h2[id], main h3[id]');
  _observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        /* right TOC + mobile "On this page" */
        document.querySelectorAll('#tocList a, .page-toc-mobile a').forEach(a =>
          a.classList.toggle('active', a.dataset.toc === id));
        /* left sidebar subsection links */
        document.querySelectorAll('.nav-sub-a').forEach(a =>
          a.classList.toggle('active', a.dataset.sub === id));
      }
    });
  }, { rootMargin: '-74px 0px -70% 0px', threshold: 0 });
  headings.forEach(h => _observer.observe(h));
}

function initMobileNav() {
  const body = document.body;
  const t = document.getElementById('menuToggle');
  const b = document.getElementById('backdrop');
  if (t) t.addEventListener('click', () => body.classList.toggle('nav-open'));
  if (b) b.addEventListener('click', () => body.classList.remove('nav-open'));
}

/* =============================================================
   Page entry points
   ============================================================= */
function initModulePage(moduleId) {
  initTheme(); initMobileNav(); initBackToTop();
  const mod = window.COURSE.find(m => m.id === moduleId);
  if (!mod) { document.getElementById('content').innerHTML = '<p>Module not found.</p>'; return; }
  function render() {
    const hash = location.hash.replace('#', '');
    const les = mod.lessons.find(l => l.id === hash) || mod.lessons[0];
    renderLesson(les, mod);
    buildSidebarModules(moduleId, les.id, les);
    rememberLastModule(mod.page, les.id);
    setupScrollSpy();
    document.body.classList.remove('nav-open');
    if (!_deepLinked) { _deepLinked = true; applySearchDeepLink(); }
  }
  let _deepLinked = false;
  window.addEventListener('hashchange', render);
  render();
}

function initSectionPage(sectionId) {
  initTheme(); initMobileNav(); initBackToTop();
  const col = window.SECTIONS.find(m => m.id === sectionId);
  if (!col) { document.getElementById('content').innerHTML = '<p>Section not found.</p>'; return; }
  function render() {
    const hash = location.hash.replace('#', '');
    const les = col.lessons.find(l => l.id === hash) || col.lessons[0];
    renderLesson(les, col);
    buildSidebarSection(col, les.id, les);
    setupScrollSpy();
    document.body.classList.remove('nav-open');
    if (!_deepLinked) { _deepLinked = true; applySearchDeepLink(); }
  }
  let _deepLinked = false;
  window.addEventListener('hashchange', render);
  render();
}

/* =============================================================
   15-Week Plan dashboard
   ============================================================= */
function initPlanPage() {
  initTheme(); initMobileNav(); initBackToTop();

  function render() {
    buildSidebar({ active: 'plan' });
    const content = document.getElementById('content');
    const weeks = window.PLAN_WEEKS || [];

    // Compute overall stats
    let totalTopics = 0, totalRead = 0;
    weeks.forEach(w => {
      totalTopics += w.topics.length;
      w.topics.forEach(t => { if (isRead(t.module, t.id)) totalRead++; });
    });

    // Find first incomplete week
    let firstUnfinished = weeks.length;
    for (let i = 0; i < weeks.length; i++) {
      const wr = weeks[i].topics.filter(t => isRead(t.module, t.id)).length;
      if (wr < weeks[i].topics.length) { firstUnfinished = i; break; }
    }
    const weeksLeft = weeks.length - firstUnfinished;
    const weeksDone = firstUnfinished;
    const overallPct = totalTopics ? Math.round(totalRead / totalTopics * 100) : 0;

    let html = `
      <div class="breadcrumb"><a href="index.html">Java Mastery</a><span class="sep">›</span><span>15-Week Study Plan</span></div>
      <h1>15-Week Study Plan</h1>
      <p class="subtitle">Week-by-week roadmap to Java interview readiness — modules, projects, and interview questions in one view.</p>

      <div class="plan-summary-row">
        <div class="plan-stat">
          <div class="plan-stat-val">${totalRead}<span class="plan-stat-of">/${totalTopics}</span></div>
          <div class="plan-stat-label">Topics Read</div>
        </div>
        <div class="plan-stat plan-stat-accent">
          <div class="plan-stat-val">${overallPct}%</div>
          <div class="plan-stat-label">Overall Progress</div>
        </div>
        <div class="plan-stat ${weeksLeft <= 3 ? 'plan-stat-warn' : ''}">
          <div class="plan-stat-val">${weeksLeft}</div>
          <div class="plan-stat-label">Weeks Remaining</div>
        </div>
        <div class="plan-stat">
          <div class="plan-stat-val">${weeksDone}<span class="plan-stat-of">/15</span></div>
          <div class="plan-stat-label">Weeks Completed</div>
        </div>
      </div>

      <div class="plan-overall-track">
        <div class="plan-overall-label">
          <span>Course progress</span>
          <span>${overallPct}%</span>
        </div>
        <div class="plan-overall-bar">
          <div class="plan-overall-fill" style="width:${overallPct}%"></div>
        </div>
      </div>

      <div class="plan-weeks">`;

    weeks.forEach((week, wi) => {
      const weekTopics = week.topics;
      const weekRead = weekTopics.filter(t => isRead(t.module, t.id)).length;
      const pct = weekTopics.length ? Math.round(weekRead / weekTopics.length * 100) : 0;
      const done = pct === 100;
      const current = wi === firstUnfinished;
      const barColor = done ? '#22c55e' : pct > 50 ? 'var(--accent-2)' : pct > 0 ? 'var(--accent)' : 'var(--border)';

      html += `<div class="week-card${done ? ' week-done' : ''}${current ? ' week-current' : ''}">
        <div class="week-header">
          <div class="week-label">
            <span class="week-num">Week ${week.week}</span>
            ${current ? '<span class="week-tag wtag-current">▶ Now</span>' : ''}
            ${done ? '<span class="week-tag wtag-done">✓ Done</span>' : ''}
          </div>
          <span class="week-pct" style="color:${done ? '#22c55e' : pct > 0 ? 'var(--accent-2)' : 'var(--text-muted)'}">${pct}%</span>
        </div>
        <div class="week-title">${week.title}</div>
        <div class="week-modules">${week.moduleLabels.map(m => `<span class="week-mod-tag">${m}</span>`).join('')}</div>

        <div class="week-prog-track">
          <div class="week-prog-fill" style="width:${pct}%;background:${barColor}"></div>
        </div>
        <div class="week-prog-counts">${weekRead}/${weekTopics.length} topics read</div>

        <div class="week-topics">
          ${weekTopics.map(t => {
            const read = isRead(t.module, t.id);
            return `<a class="week-topic-chip${read ? ' chip-read' : ''}" href="${t.page}#${t.id}">${read ? '✓ ' : ''}${t.title}</a>`;
          }).join('')}
        </div>

        ${week.project ? `<div class="week-row week-project-row">
          <span class="week-badge wbadge-project">🏗️ Project</span>
          <a href="projects.html#${week.project.id}" class="week-proj-link">${week.project.title}</a>
          <span class="wphase-tag">${week.project.phase}</span>
        </div>` : ''}

        <div class="week-row week-iq-row">
          <span class="week-badge wbadge-iq">🎯 IQ Focus</span>
          ${week.iqTopics.map(q => `<span class="iq-chip">${q}</span>`).join('')}
        </div>
      </div>`;
    });

    html += `</div>`;
    content.innerHTML = html;
    window.scrollTo(0, 0);
  }

  render();
}

/* =============================================================
   Floating UI (global): back-to-top button + mobile "On this page".
   On desktop module pages the scroll happens inside #content; on the
   home page and on phones it's the window. We listen to both and key
   off whichever has scrolled, so the same logic works everywhere.
   ============================================================= */
let _floatingWired = false;
const _FLOAT_THRESHOLD = 220;

function _scrolledAmount() {
  const c = document.getElementById('content');
  return Math.max(window.scrollY || 0, (c && c.scrollTop) || 0);
}

function updateFloatingUI() {
  const past = _scrolledAmount() > _FLOAT_THRESHOLD;
  const btn = document.getElementById('back-to-top');
  if (btn) btn.classList.toggle('visible', past);
  const ptm = document.querySelector('.page-toc-mobile');
  if (ptm) ptm.classList.toggle('ptm-visible', past);
}

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!_floatingWired) {
    _floatingWired = true;
    window.addEventListener('scroll', updateFloatingUI, { passive: true });
    const c = document.getElementById('content');
    if (c) c.addEventListener('scroll', updateFloatingUI, { passive: true });
    if (btn) btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const cc = document.getElementById('content');
      if (cc) cc.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  updateFloatingUI();
}

/* =============================================================
   Full-text search across the whole course
   Index → query parser ("phrase", +required, OR) → overlay of tiles
   ============================================================= */
let _searchIndex = null;

/* Convert a rendered HTML section body into clean text "lines". */
function _htmlToLines(html) {
  let s = String(html)
    .replace(/<\/(p|li|h[1-6]|tr|pre|blockquote|div)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  return s.split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(l => l.length > 1);
}

/* Build (and cache) the searchable index from every real lesson. */
function buildSearchIndex() {
  if (_searchIndex) return _searchIndex;
  const idx = [];
  window.COURSE.concat(window.SECTIONS).forEach(col => {
    (col.lessons || []).forEach(les => {
      const pageTitle = (les.chapter ? les.chapter + ' ' : '') + les.title;
      const sections = [];
      (les.sections || []).forEach(sec => {
        if (!sec.body || /class="placeholder"/.test(sec.body)) return; // skip stubs
        const lines = _htmlToLines(sec.body);
        if (lines.length) sections.push({ id: sec.id, heading: sec.heading, lines });
      });
      idx.push({
        page: col.page, lessonId: les.id, pageTitle,
        title: les.title, moduleTitle: col.module, sections
      });
    });
  });
  _searchIndex = idx;
  return idx;
}

/* Parse a raw query into "exact phrases", +required terms, and normal terms. */
function _parseQuery(q) {
  const phrases = [];
  let rest = String(q).replace(/"([^"]+)"/g, (m, p) => {
    const t = p.trim().toLowerCase(); if (t) phrases.push(t); return ' ';
  });
  const required = [], terms = [];
  rest.split(/\s+/).forEach(tok => {
    tok = tok.trim(); if (!tok) return;
    if (tok[0] === '+' && tok.length > 1) required.push(tok.slice(1).toLowerCase());
    else terms.push(tok.toLowerCase());
  });
  return { phrases, required, terms, tokens: phrases.concat(required, terms) };
}

/* Run the search; returns ranked results, each with per-section matches. */
function searchCourse(q) {
  const { phrases, required, terms, tokens } = _parseQuery(q);
  if (!tokens.length) return [];
  const results = [];
  buildSearchIndex().forEach(entry => {
    const titleLower = entry.pageTitle.toLowerCase();
    const combined = (titleLower + '\n' +
      entry.sections.map(s => s.lines.join('\n')).join('\n')).toLowerCase();

    // qualification: all phrases + all required must appear; if normal terms
    // exist at least one must appear.
    if (!phrases.every(t => combined.includes(t))) return;
    if (!required.every(t => combined.includes(t))) return;
    if (terms.length && !terms.some(t => combined.includes(t))) return;

    let score = 0;
    tokens.forEach(t => { if (titleLower.includes(t)) score += 5; });
    const matches = [];
    entry.sections.forEach(sec => {
      const headingLower = sec.heading.toLowerCase();
      sec.lines.forEach((line, li) => {
        const lower = line.toLowerCase();
        const tok = tokens.find(t => lower.includes(t));
        if (!tok) return;
        score += 1 + (headingLower.includes(tok) ? 1 : 0);
        if (matches.length < 4) {
          matches.push({
            sectionId: sec.id, heading: sec.heading, token: tok, line,
            prev: li > 0 ? sec.lines[li - 1] : '',
            next: li < sec.lines.length - 1 ? sec.lines[li + 1] : ''
          });
        }
      });
    });
    if (!matches.length) {  // matched only in the page title
      matches.push({
        sectionId: (entry.sections[0] || {}).id || '', heading: 'Page title',
        token: tokens.find(t => titleLower.includes(t)) || tokens[0],
        line: entry.pageTitle, prev: '', next: ''
      });
    }
    results.push({ page: entry.page, lessonId: entry.lessonId,
      pageTitle: entry.pageTitle, moduleTitle: entry.moduleTitle, matches, score });
  });
  results.sort((a, b) => b.score - a.score);
  return results;
}

function _escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
/* Bold every occurrence of token inside an (escaped) line. */
function _emph(line, token) {
  const esc = _escHtml(line);
  if (!token) return esc;
  const rx = new RegExp('(' + token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
  return esc.replace(rx, '<strong class="so-kw">$1</strong>');
}
/* Compact snippet: ~4 words either side of the matched word. */
function _compactSnippet(line, token) {
  const words = line.split(/\s+/);
  const first = token.split(' ')[0];
  let wi = words.findIndex(w => w.toLowerCase().includes(first));
  if (wi < 0) wi = 0;
  const start = Math.max(0, wi - 4), end = Math.min(words.length, wi + 5);
  let snip = words.slice(start, end).join(' ');
  if (start > 0) snip = '… ' + snip;
  if (end < words.length) snip += ' …';
  return _emph(snip, token);
}

let _searchQuery = '';
let _searchOverlay = null;

/* Build the results grid markup for a query + its results. */
function _renderResultsHTML(q, results) {
  if (!results.length) {
    return '<div class="so-empty">No matches for <strong>' + _escHtml(q) + '</strong>.' +
      '<br>Try fewer or different words, the <code>"exact phrase"</code> / <code>+word</code> ' +
      'helpers, or the “Try Google” button above.</div>';
  }
  const grid = results.map(p => {
    const hits = p.matches.map(m => {
      const compact = '<span class="so-hit-compact">' + _compactSnippet(m.line, m.token) + '</span>';
      let detail = '<span class="so-hit-detail">';
      if (m.prev) detail += '<span class="so-ctx">' + _emph(m.prev, m.token) + '</span>';
      detail += '<span class="so-cur">' + _emph(m.line, m.token) + '</span>';
      if (m.next) detail += '<span class="so-ctx">' + _emph(m.next, m.token) + '</span>';
      detail += '</span>';
      return '<button class="so-hit" type="button" ' +
        'data-page="' + _escHtml(p.page) + '" data-lesson="' + _escHtml(p.lessonId) + '" ' +
        'data-sec="' + _escHtml(m.sectionId) + '" data-hl="' + _escHtml(m.token) + '">' +
        '<span class="so-hit-sec">' + _escHtml(m.heading) + '</span>' +
        compact + detail + '</button>';
    }).join('');
    return '<div class="so-tile">' +
      '<div class="so-tile-title">' + _escHtml(p.pageTitle) + '</div>' +
      '<div class="so-tile-module">' + _escHtml(p.moduleTitle) + '</div>' +
      hits + '</div>';
  }).join('');
  return '<div class="so-grid">' + grid + '</div>';
}

/* Create the overlay once and wire its persistent controls. */
function _ensureSearchOverlay() {
  if (_searchOverlay) return _searchOverlay;
  const ov = document.createElement('div');
  ov.id = 'search-overlay';
  ov.className = 'search-overlay';
  ov.hidden = true;
  ov.innerHTML =
    '<div class="so-panel">' +
      '<div class="so-bar">' +
        '<span class="so-bar-ic">🔍</span>' +
        '<input class="so-input" type="text" placeholder="Search the course…" aria-label="Search" />' +
        '<button class="so-go" type="button">Search</button>' +
        '<a class="so-tips-toggle" role="button" tabindex="0">How to search better ▾</a>' +
        '<button class="so-close" type="button" title="Close (Esc)">✕</button>' +
      '</div>' +
      '<div class="so-tips" hidden>' +
        '<strong>Search tips</strong>' +
        '<ul>' +
          '<li><b>Exact phrase</b> — wrap words in quotes: <code>"garbage collection"</code> finds those words together.</li>' +
          '<li><b>Require a word</b> — put <code>+</code> in front: <code>+stream +collector</code> returns only pages containing <em>both</em>.</li>' +
          '<li><b>Any words</b> — plain words match pages containing <em>any</em> of them; pages with more matches rank higher.</li>' +
          '<li><b>Combine them</b> — e.g. <code>+exception "stack trace"</code>.</li>' +
        '</ul>' +
      '</div>' +
      '<div class="so-toolbar">' +
        '<button class="so-google" type="button">🌐 Don\'t find anything? Try Google! …</button>' +
        '<span class="so-count"></span>' +
        '<button class="so-detail-toggle" type="button">See more details …</button>' +
      '</div>' +
      '<div class="so-results"></div>' +
    '</div>' +
    '<button class="so-totop" type="button" title="Back to top">↑</button>';
  document.body.appendChild(ov);
  _searchOverlay = ov;

  const $ = sel => ov.querySelector(sel);
  $('.so-close').addEventListener('click', closeSearch);
  $('.so-go').addEventListener('click', () => openSearch($('.so-input').value));
  $('.so-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') openSearch($('.so-input').value);
  });
  $('.so-tips-toggle').addEventListener('click', () => {
    const tips = $('.so-tips'); tips.hidden = !tips.hidden;
  });
  $('.so-detail-toggle').addEventListener('click', () => {
    const res = $('.so-results'); const on = res.classList.toggle('detailed');
    $('.so-detail-toggle').textContent = on ? 'Show less ▴' : 'See more details …';
  });
  $('.so-google').addEventListener('click', () => {
    const term = (_searchQuery || $('.so-input').value || '').trim();
    const url = 'https://www.google.com/search?q=' +
      encodeURIComponent('what is this in Java development - ' + term);
    window.open(url, '_blank', 'noopener');
  });
  $('.so-totop').addEventListener('click', () =>
    ov.scrollTo({ top: 0, behavior: 'smooth' }));
  ov.addEventListener('scroll', () =>
    $('.so-totop').classList.toggle('visible', ov.scrollTop > 240), { passive: true });
  // delegated click → jump to the exact spot in the real page
  $('.so-results').addEventListener('click', e => {
    const hit = e.target.closest('.so-hit'); if (!hit) return;
    const d = hit.dataset;
    const url = d.page + '?sec=' + encodeURIComponent(d.sec) +
      '&hl=' + encodeURIComponent(d.hl) + '#' + encodeURIComponent(d.lesson);
    window.location.href = url;
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !ov.hidden) closeSearch();
  });
  return ov;
}

/* Open the overlay for a query and render results.
   An empty query just opens the overlay (used by the mobile search icon). */
function openSearch(q) {
  q = (q || '').trim();
  _searchQuery = q;
  const ov = _ensureSearchOverlay();
  const input = ov.querySelector('.so-input');
  const res = ov.querySelector('.so-results');
  input.value = q;
  res.classList.remove('detailed');
  ov.querySelector('.so-detail-toggle').textContent = 'See more details …';
  if (!q) {
    ov.querySelector('.so-count').textContent = '';
    res.innerHTML = '<div class="so-empty">Type a keyword above and press Enter to search the course.</div>';
  } else {
    const results = searchCourse(q);
    ov.querySelector('.so-count').textContent =
      results.length + (results.length === 1 ? ' page' : ' pages') + ' for “' + q + '”';
    res.innerHTML = _renderResultsHTML(q, results);
  }
  ov.hidden = false;
  document.body.classList.add('search-open');
  ov.scrollTop = 0;
  if (!q) setTimeout(() => input.focus(), 50);
}
function closeSearch() {
  if (!_searchOverlay) return;
  _searchOverlay.hidden = true;
  document.body.classList.remove('search-open');
}

/* Wire the header search box on every page. */
function initSearch() {
  document.querySelectorAll('.search input').forEach(input => {
    input.placeholder = 'Search the course…';
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); openSearch(input.value); }
    });
  });
  document.querySelectorAll('.search > span').forEach(icon => {
    icon.style.cursor = 'pointer';
    icon.addEventListener('click', () => {
      const input = icon.parentElement.querySelector('input');
      if (input) openSearch(input.value);
    });
  });
  // mobile: the inline search box is hidden; add an icon that opens the overlay
  document.querySelectorAll('.header-right').forEach(hr => {
    if (hr.querySelector('.search-mobile-btn')) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'search-mobile-btn';
    b.setAttribute('aria-label', 'Search');
    b.textContent = '🔍';
    b.addEventListener('click', () => openSearch(''));
    hr.insertBefore(b, hr.firstChild);
  });
}

/* Wrap occurrences of `term` inside root in <mark>; return the first mark. */
function _highlightText(root, term) {
  if (!root || !term) return null;
  const rx = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig');
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) {
    const p = n.parentNode;
    if (!p || /^(MARK|SCRIPT|STYLE)$/.test(p.nodeName)) continue;
    rx.lastIndex = 0;
    if (rx.test(n.nodeValue)) nodes.push(n);
  }
  let first = null;
  nodes.forEach(node => {
    const s = node.nodeValue; const frag = document.createDocumentFragment();
    let last = 0, m; rx.lastIndex = 0;
    while ((m = rx.exec(s))) {
      if (m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
      const mk = document.createElement('mark'); mk.className = 'search-hit'; mk.textContent = m[0];
      frag.appendChild(mk); if (!first) first = mk;
      last = m.index + m[0].length;
      if (m.index === rx.lastIndex) rx.lastIndex++;   // guard against zero-length
    }
    if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
    node.parentNode.replaceChild(frag, node);
  });
  return first;
}

/* On a lesson page, if arrived via a search result, scroll to + highlight it. */
function applySearchDeepLink() {
  const params = new URLSearchParams(location.search);
  const sec = params.get('sec'); const hl = params.get('hl');
  if (!sec && !hl) return;
  // consume the params so later in-page navigation doesn't re-trigger
  history.replaceState(null, '', location.pathname + location.hash);
  const content = document.getElementById('content');
  if (!content) return;
  const firstMark = hl ? _highlightText(content, hl) : null;
  let target = null;
  if (sec) {
    const secEl = document.getElementById(sec);
    if (secEl) {
      const marks = [...content.querySelectorAll('mark.search-hit')];
      target = marks.find(mk =>
        secEl.compareDocumentPosition(mk) & Node.DOCUMENT_POSITION_FOLLOWING) || secEl;
    }
  }
  target = target || firstMark;
  if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
}

/* =============================================================
   Home-page: scroll-triggered section collapse bars
   ============================================================= */
function initHomeSections() {
  const strip = document.getElementById('section-bar-strip');
  const sections = [...document.querySelectorAll('.home-section[id]')];
  if (!strip || !sections.length) return;

  /* Build one bar per section (hidden initially) */
  const bars = sections.map(sec => {
    const kicker = sec.querySelector('.kicker');
    const h2     = sec.querySelector('h2');
    const bar = document.createElement('button');
    bar.type = 'button';
    bar.className = 'scb';
    bar.dataset.target = sec.id;
    bar.innerHTML =
      `<span class="scb-kicker">${kicker ? kicker.textContent : ''}</span>` +
      `<span class="scb-title">${h2 ? h2.textContent : ''}</span>` +
      `<span class="scb-arrow">↑</span>`;
    bar.addEventListener('click', () =>
      sec.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    strip.appendChild(bar);
    return bar;
  });

  function update() {
    const HEADER = 58;
    let lastVisible = -1;
    sections.forEach((sec, i) => {
      const top = sec.getBoundingClientRect().top;
      if (top < HEADER + 4) {          /* section has scrolled above header */
        bars[i].classList.add('scb-visible');
        lastVisible = i;
      } else {
        bars[i].classList.remove('scb-visible', 'scb-active');
      }
    });
    /* Highlight only the most-recently-passed section bar */
    bars.forEach((b, i) => b.classList.toggle('scb-active', i === lastVisible));
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* =============================================================
   Landing page
   ============================================================= */
function buildHome() {
  initTheme();
  const modGrid = document.getElementById('moduleGrid');
  if (modGrid) {
    modGrid.innerHTML = window.COURSE.map((mod, mi) => `
      <a class="tile" href="${mod.page}">
        <div class="tile-icon">${mod.icon || '📦'}</div>
        <div class="tile-body">
          <div class="tile-num">Module ${String(mi + 1).padStart(2, '0')}</div>
          <h3>${mod.module}</h3>
          <p>${mod.tagline || ''}</p>
        </div>
        <div class="tile-foot"><span>${mod.lessons.length} chapters</span><span class="go">→</span></div>
      </a>`).join('');
  }
  // grids that pull a collection's lessons as tiles (projects, interview banks)
  document.querySelectorAll('[data-collection-grid]').forEach(grid => {
    const col = getCollection(grid.dataset.collectionGrid);
    if (!col) return;
    grid.innerHTML = col.lessons.map((les, i) => `
      <a class="tile" href="${col.page}#${les.id}">
        <div class="tile-icon">${les.icon || col.icon || '✨'}</div>
        <div class="tile-body">
          <div class="tile-num">${les.chapter ? les.chapter : (i + 1)}</div>
          <h3>${les.title}</h3>
          <p>${les.subtitle || ''}</p>
        </div>
        <div class="tile-foot"><span>${les.tag || ''}</span><span class="go">→</span></div>
      </a>`).join('');
  });
}
