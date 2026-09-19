/* ============================================================
   技换 SkillSwap · 应用逻辑
   模块：Seed 种子数据 / Store 数据层 / Router 路由 /
        Views 视图渲染 / Matcher 匹配引擎 / 交换状态机 / 信用体系
   ============================================================ */
"use strict";

/* ================= 常量 ================= */
const ME_ID = "me";
const LS_KEY = "skillswap_v1";

const CATEGORIES = ["编程", "乐器", "语言", "设计", "摄影", "生活", "运动", "职场"];
const CAT_COLORS = {
  "编程": "#3B82F6", "乐器": "#F97316", "语言": "#22C55E", "设计": "#A855F7",
  "摄影": "#EF4444", "生活": "#F59E0B", "运动": "#10B981", "职场": "#6366F1"
};
const LEVELS = ["入门", "熟练", "精通", "大神"];
const BADGES = [
  { name: "新手村",     min: 0,   icon: "🌱", desc: "加入技换大家庭" },
  { name: "靠谱交换者", min: 50,  icon: "🤝", desc: "信用分达 50" },
  { name: "技能达人",   min: 100, icon: "🏆", desc: "信用分达 100" }
];
const CREDIT_RULES = { complete: 10, goodReview: 5, noShow: -15 };

/* ================= 工具 ================= */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const norm = (s) => String(s || "").trim().toLowerCase();

/* ================= 种子数据 ================= */
function buildSeed() {
  const users = [
    { id: ME_ID,  name: "我",       avatar: "😎", credit: 60 },
    { id: "u01", name: "阿澈",      avatar: "🦊", credit: 128 },
    { id: "u02", name: "小鹿",      avatar: "🦌", credit: 86 },
    { id: "u03", name: "Kevin",     avatar: "🐯", credit: 45 },
    { id: "u04", name: "桃子",      avatar: "🍑", credit: 152 },
    { id: "u05", name: "老白",      avatar: "🐼", credit: 73 },
    { id: "u06", name: "Momo",      avatar: "🐱", credit: 38 },
    { id: "u07", name: "阿凯",      avatar: "🦁", credit: 96 },
    { id: "u08", name: "西西",      avatar: "🐰", credit: 64 }
  ];
  // type: teach=我能教 / learn=我想学
  const skills = [
    { id: "s01", userId: "u01", type: "teach", title: "Python 数据分析", category: "编程", level: 3, mode: "线上", desc: "pandas / 可视化 / 爬虫实战，带你从 Excel 进阶到自动化报表。", want: "吉他指弹", paid: true },
    { id: "s02", userId: "u01", type: "learn", title: "吉他指弹", category: "乐器", level: 0, mode: "线上", desc: "零基础，想学会《晴天》前奏。", want: "", paid: false },
    { id: "s03", userId: "u02", type: "teach", title: "日语 N2 备考", category: "语言", level: 2, mode: "线上", desc: "一年过 N2 的野路子，分享真题节奏与口语陪练。", want: "视频剪辑", paid: false },
    { id: "s04", userId: "u02", type: "learn", title: "视频剪辑", category: "设计", level: 0, mode: "线上", desc: "想给 vlog 做出电影感转场。", want: "", paid: false },
    { id: "s05", userId: "u03", type: "teach", title: "吉他指弹", category: "乐器", level: 3, mode: "线下", desc: "十年琴龄，擅长岸部真明风格，可带零基础入门。", want: "Python 数据分析", paid: false },
    { id: "s06", userId: "u03", type: "learn", title: "Python 数据分析", category: "编程", level: 0, mode: "线上", desc: "想自动化处理琴行的排课表。", want: "", paid: false },
    { id: "s07", userId: "u04", type: "teach", title: "人像摄影", category: "摄影", level: 3, mode: "线下", desc: "教你用自然光拍出氛围感人像，附后期调色思路。", want: "英语口语", paid: true },
    { id: "s08", userId: "u04", type: "learn", title: "英语口语", category: "语言", level: 1, mode: "线上", desc: "能读能写不敢开口，求陪练。", want: "", paid: false },
    { id: "s09", userId: "u05", type: "teach", title: "英语口语陪练", category: "语言", level: 2, mode: "线上", desc: "海归，商务/日常口语均可，纠正发音一针见血。", want: "人像摄影", paid: false },
    { id: "s10", userId: "u05", type: "learn", title: "人像摄影", category: "摄影", level: 0, mode: "线下", desc: "想给女朋友拍出好看的照片。", want: "", paid: false },
    { id: "s11", userId: "u06", type: "teach", title: "视频剪辑", category: "设计", level: 2, mode: "线上", desc: "剪映/PR 双修，短视频节奏与转场教学。", want: "日语入门", paid: false },
    { id: "s12", userId: "u06", type: "learn", title: "日语入门", category: "语言", level: 0, mode: "线上", desc: "为了生肉番剧，冲！", want: "", paid: false },
    { id: "s13", userId: "u07", type: "teach", title: "前端开发入门", category: "编程", level: 3, mode: "线上", desc: "HTML/CSS/JS 三件套，带你做出第一个个人主页。", want: "咖啡拉花", paid: true },
    { id: "s14", userId: "u07", type: "learn", title: "咖啡拉花", category: "生活", level: 0, mode: "线下", desc: "想在周末摆摊卖咖啡。", want: "", paid: false },
    { id: "s15", userId: "u08", type: "teach", title: "咖啡拉花", category: "生活", level: 2, mode: "线下", desc: "从业三年咖啡师，教你打出第一颗爱心。", want: "前端开发入门", paid: false },
    { id: "s16", userId: "u08", type: "learn", title: "前端开发入门", category: "编程", level: 0, mode: "线上", desc: "想给自己的咖啡店做个小程序。", want: "", paid: false },
    { id: "s17", userId: "u04", type: "teach", title: "手机修图术", category: "摄影", level: 2, mode: "线上", desc: "Snapseed + 醒图，废片拯救指南。", want: "烘焙", paid: false },
    { id: "s18", userId: "u05", type: "teach", title: "简历修改", category: "职场", level: 3, mode: "线上", desc: "大厂 HR 视角，帮你看简历、模拟面试。", want: "健身计划", paid: true },
    { id: "s19", userId: "u03", type: "teach", title: "健身计划定制", category: "运动", level: 2, mode: "线下", desc: "徒手+器械，给你一份能坚持的训练表。", want: "简历修改", paid: false },
    { id: "s20", userId: "u06", type: "teach", title: "手绘头像", category: "设计", level: 2, mode: "线上", desc: "Q 版头像定制教学，Procreate 入门。", want: "Python 数据分析", paid: false },
    { id: "s21", userId: "u02", type: "teach", title: "家庭烘焙", category: "生活", level: 2, mode: "线下", desc: "零失败戚风与巴斯克，工具清单全分享。", want: "手机修图术", paid: false }
  ];
  const requests = [
    { id: "r01", from: "u01", to: ME_ID, fromSkill: "Python 数据分析", toSkill: "我发布的技能",
      form: "线上 · 每周 2 次", period: "1 个月", note: "看到你想学数据分析，我想学吉他，互换吗？",
      status: "pending", createdAt: Date.now() - 86400000 * 2 },
    { id: "r02", from: ME_ID, to: "u04", fromSkill: "我发布的技能", toSkill: "人像摄影",
      form: "线下 · 周末", period: "2 周", note: "想学人像摄影，可以教你我的技能～",
      status: "accepted", createdAt: Date.now() - 86400000 * 5 }
  ];
  const reviews = [
    { id: "v01", from: "u04", to: ME_ID, stars: 5, text: "非常靠谱的交换伙伴，备课超认真！", createdAt: Date.now() - 86400000 * 10 },
    { id: "v02", from: "u07", to: ME_ID, stars: 4, text: "讲解清晰，就是偶尔拖堂哈哈。", createdAt: Date.now() - 86400000 * 20 },
    { id: "v03", from: ME_ID, to: "u04", stars: 5, text: "桃子老师的摄影课干货满满。", createdAt: Date.now() - 86400000 * 10 }
  ];
  const exchangesDone = 356; // 平台累计成功交换（看板展示基数）
  return { users, skills, requests, reviews, exchangesDone, seededAt: Date.now() };
}

/* ================= Store 数据层 ================= */
const Store = {
  data: null,
  load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        this.data = JSON.parse(raw);
        if (this.data && Array.isArray(this.data.skills)) return;
      }
    } catch (e) { /* 数据损坏时回退种子 */ }
    this.data = buildSeed();
    this.save();
  },
  save() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(this.data)); }
    catch (e) { console.warn("localStorage 写入失败", e); }
  },
  reset() { this.data = buildSeed(); this.save(); },

  me() { return this.data.users.find((u) => u.id === ME_ID); },
  user(id) { return this.data.users.find((u) => u.id === id); },
  badgesOf(user) { return BADGES.filter((b) => user.credit >= b.min); },
  topBadge(user) { const b = this.badgesOf(user); return b[b.length - 1]; },

  teachSkills(uid_) { return this.data.skills.filter((s) => s.userId === uid_ && s.type === "teach"); },
  learnSkills(uid_) { return this.data.skills.filter((s) => s.userId === uid_ && s.type === "learn"); },
  addSkill(skill) { this.data.skills.unshift({ id: uid(), createdAt: Date.now(), ...skill }); this.save(); },
  removeSkill(id) { this.data.skills = this.data.skills.filter((s) => s.id !== id); this.save(); },

  addRequest(req) { this.data.requests.unshift({ id: uid(), createdAt: Date.now(), status: "pending", ...req }); this.save(); },
  request(id) { return this.data.requests.find((r) => r.id === id); },
  setRequestStatus(id, status) {
    const r = this.request(id);
    if (r) { r.status = status; r.updatedAt = Date.now(); this.save(); }
    return r;
  },
  pendingReceivedCount() {
    return this.data.requests.filter((r) => r.to === ME_ID && r.status === "pending").length;
  },

  addReview(rev) { this.data.reviews.unshift({ id: uid(), createdAt: Date.now(), ...rev }); this.save(); },
  reviewsOf(uid_) { return this.data.reviews.filter((r) => r.to === uid_); },

  addCredit(uid_, delta, reason = "") {
    const u = this.user(uid_);
    if (!u) return;
    u.credit = Math.max(0, u.credit + delta);
    this.save();
    if (uid_ === ME_ID && delta !== 0) {
      toast(`${delta > 0 ? "+" : ""}${delta} 信用分${reason ? " · " + reason : ""}`, delta > 0 ? "success" : "error");
    }
  }
};

/* ================= Toast & Confetti ================= */
function toast(msg, type = "") {
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = msg;
  $("#toast-root").appendChild(el);
  setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 320); }, 2400);
}
function confetti(n = 80) {
  const root = $("#confetti-root");
  const colors = ["#7C3AED", "#A855F7", "#F97316", "#FBBF24", "#22C55E", "#3B82F6"];
  for (let i = 0; i < n; i++) {
    const p = document.createElement("i");
    p.className = "confetti-piece";
    const size = 6 + Math.random() * 8;
    p.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size * (Math.random() > .5 ? 1 : .4)}px;` +
      `background:${colors[i % colors.length]};animation-duration:${1.6 + Math.random() * 1.6}s;animation-delay:${Math.random() * .3}s;`;
    root.appendChild(p);
    setTimeout(() => p.remove(), 3600);
  }
}

/* ================= 通用片段 ================= */
const catColor = (c) => CAT_COLORS[c] || "#7C3AED";
const levelDots = (lv) =>
  `<span class="level-dots" title="${LEVELS[lv]}">${[0, 1, 2, 3].map((i) => `<i class="${i <= lv ? "on" : ""}"></i>`).join("")}</span>`;
const badgeMini = (u) => {
  const b = Store.topBadge(u);
  return b.min >= 100 ? `<span class="badge-mini">${b.icon} ${b.name}</span>`
       : b.min >= 50  ? `<span class="badge-mini purple">${b.icon} ${b.name}</span>`
       : `<span class="badge-mini green">${b.icon} ${b.name}</span>`;
};
const avatarHtml = (u) => `<span class="avatar">${esc(u.avatar)}</span>`;
const ownerHtml = (u) => `
  <div class="card-owner">
    ${avatarHtml(u)}
    <div class="owner-meta">
      <div class="owner-name">${esc(u.name)} ${badgeMini(u)}</div>
      <div class="owner-credit">信用 ${u.credit} 分</div>
    </div>
  </div>`;

function skillCard(s) {
  const u = Store.user(s.userId);
  const isMe = s.userId === ME_ID;
  return `
  <article class="skill-card" style="--cat-color:${catColor(s.category)}">
    <div class="card-top">
      <span class="cat-pill">${esc(s.category)}</span>
      <span class="mode-pill">${esc(s.mode)}</span>
    </div>
    <h3>${esc(s.title)} ${levelDots(s.level)}</h3>
    <p class="desc">${esc(s.desc)}</p>
    ${ownerHtml(u)}
    <div class="want-row">⇄ 想换：${esc(s.want || "任意技能，聊得来就行")}${s.paid ? " · 💰 也可付费请教" : ""}</div>
    <div class="card-actions">
      ${isMe
        ? `<span class="badge-mini purple">我发布的</span>`
        : `<button class="btn btn-grad btn-sm" data-action="swap" data-skill="${s.id}">发起交换</button>`}
    </div>
  </article>`;
}

/* ================= 视图：首页 ================= */
function renderHome() {
  const el = $("#view-home");
  const skills = Store.data.skills.filter((s) => s.type === "teach");
  const featured = skills.slice(0, 6);
  const tags = CATEGORIES.map((c) =>
    `<button class="tag-chip" style="background:linear-gradient(135deg, ${catColor(c)}, ${catColor(c)}CC)" data-goto="plaza" data-cat="${c}">${c}</button>`
  ).join("");

  el.innerHTML = `
  <div class="hero">
    <span class="hero-blob b1"></span><span class="hero-blob b2"></span><span class="hero-blob b3"></span>
    <div class="wrap hero-inner">
      <span class="hero-eyebrow">⇄ 技能互换社区 · 无需注册即可体验</span>
      <h1>用你的技能，<br /><span class="shine">换一个新世界</span></h1>
      <p class="sub">报班太贵，自学太难坚持？发布「我能教的」与「我想学的」，让系统为你找到那个正好互补的人。</p>
      <div class="hero-cta">
        <a class="btn btn-grad" href="#/publish">＋ 发布我的技能</a>
        <a class="btn btn-ghost" href="#/plaza">逛逛技能广场</a>
      </div>
    </div>
  </div>

  <div class="section wrap">
    <div class="section-head">
      <div class="eyebrow">HOW IT WORKS</div>
      <h2>三步，完成一次技能交换</h2>
      <p>不需要钱，只需要你身上那点「别人没有的东西」</p>
    </div>
    <div class="steps">
      <div class="step-card"><div class="step-no">01</div><h3>发布技能</h3><p>写下你能教的和想学的，30 秒完成上架，即刻进入匹配池。</p></div>
      <div class="step-card"><div class="step-no">02</div><h3>智能匹配</h3><p>双向匹配算法找到「你教的 = TA 想学的」完美搭档，按匹配度排序。</p></div>
      <div class="step-card"><div class="step-no">03</div><h3>达成交换</h3><p>发起交换请求，签订轻量契约，完成后互评积累信用与徽章。</p></div>
    </div>
  </div>

  <div class="section wrap">
    <div class="section-head">
      <div class="eyebrow">TRENDING</div>
      <h2>热门技能方向</h2>
      <p>点击标签，直达对应分类的技能广场</p>
    </div>
    <div class="tag-cloud">${tags}</div>
  </div>

  <div class="section wrap">
    <div class="section-head">
      <div class="eyebrow">FEATURED</div>
      <h2>精选技能卡片</h2>
      <p>社区里最受欢迎的教学者们</p>
    </div>
    <div class="card-grid">${featured.map(skillCard).join("")}</div>
  </div>

  <div class="section wrap">
    <div class="stats-band">
      <div class="stat-item"><div class="stat-num" data-count="${skills.length}">0</div><div class="stat-label">在册技能</div></div>
      <div class="stat-item"><div class="stat-num" data-count="${Store.data.users.length + 1286}">0</div><div class="stat-label">注册用户</div></div>
      <div class="stat-item"><div class="stat-num" data-count="${Store.data.exchangesDone}"><span class="plus">0</span></div><div class="stat-label">成功交换</div></div>
      <div class="stat-item"><div class="stat-num" data-count="98"><span class="plus">0</span></div><div class="stat-label">好评率 %</div></div>
    </div>
  </div>`;

  // 数字滚动动画
  $$(".stat-num", el).forEach((n) => {
    const target = +n.dataset.count;
    const start = performance.now(), dur = 1400;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const v = Math.round(target * (1 - Math.pow(1 - p, 3)));
      n.innerHTML = p === 1 && target >= 100 ? `${v}<span class="plus">+</span>` : v;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/* ================= 视图：技能广场 ================= */
const plazaState = { cat: "全部", kw: "" };
function renderPlaza() {
  const el = $("#view-plaza");
  const { cat, kw } = plazaState;
  let list = Store.data.skills.filter((s) => s.type === "teach");
  if (cat !== "全部") list = list.filter((s) => s.category === cat);
  if (kw) {
    const k = norm(kw);
    list = list.filter((s) =>
      norm(s.title).includes(k) || norm(s.desc).includes(k) || norm(Store.user(s.userId).name).includes(k));
  }
  const cats = ["全部", ...CATEGORIES];
  el.innerHTML = `
  <div class="section wrap">
    <div class="section-head">
      <div class="eyebrow">SKILL PLAZA</div>
      <h2>技能广场</h2>
      <p>每一张卡片背后，都是一个愿意倾囊相授的人</p>
    </div>
    <div class="plaza-toolbar">
      <div class="search-box">
        <span>🔍</span>
        <input id="plazaSearch" type="text" placeholder="搜索技能 / 教学者，如：Python、吉他、桃子…" value="${esc(kw)}" />
      </div>
      <div class="filter-row">
        ${cats.map((c) => `<button class="filter-chip ${c === cat ? "active" : ""}" data-cat="${c}">${c}</button>`).join("")}
      </div>
    </div>
    ${list.length
      ? `<div class="card-grid">${list.map(skillCard).join("")}</div>`
      : `<div class="empty-state"><span class="big">🫧</span>没有找到相关技能，试试换个关键词，或者<a href="#/publish" style="color:var(--violet);font-weight:700">自己发布一个</a>？</div>`}
  </div>`;

  $("#plazaSearch").addEventListener("input", (e) => {
    plazaState.kw = e.target.value;
    clearTimeout(renderPlaza._t);
    renderPlaza._t = setTimeout(() => { renderPlaza(); $("#plazaSearch").focus(); }, 250);
  });
  $$(".filter-chip", el).forEach((b) =>
    b.addEventListener("click", () => { plazaState.cat = b.dataset.cat; renderPlaza(); }));
}

/* ================= 视图：发布技能 ================= */
function renderPublish() {
  const el = $("#view-publish");
  el.innerHTML = `
  <div class="section wrap" style="max-width:960px">
    <div class="section-head">
      <div class="eyebrow">PUBLISH</div>
      <h2>发布我的技能</h2>
      <p>左边写你能教的，右边写你想学的 —— 双向信息越完整，匹配越精准</p>
    </div>
    <form id="publishForm" novalidate>
      <div class="publish-grid">
        <div class="form-panel teach">
          <div class="panel-head">🍊 我能教的</div>
          <div class="panel-body">
            <div class="field" data-req>
              <label>技能名称 *</label>
              <input type="text" name="teachTitle" placeholder="如：Python 数据分析 / 吉他指弹" maxlength="20" />
              <div class="err">请填写技能名称</div>
            </div>
            <div class="field" data-req>
              <label>分类 *</label>
              <select name="teachCat"><option value="">请选择分类</option>${CATEGORIES.map((c) => `<option>${c}</option>`).join("")}</select>
              <div class="err">请选择分类</div>
            </div>
            <div class="field">
              <label>熟练程度</label>
              <div class="range-row">
                <input type="range" name="teachLevel" min="0" max="3" value="2" />
                <span class="range-val" data-for="teachLevel">${LEVELS[2]}</span>
              </div>
            </div>
            <div class="field">
              <label>授课形式</label>
              <select name="teachMode"><option>线上</option><option>线下</option><option>均可</option></select>
            </div>
            <div class="field">
              <label>一句话简介</label>
              <textarea name="teachDesc" placeholder="你能教到什么程度？适合什么样的人？" maxlength="120"></textarea>
            </div>
            <div class="field switch-row">
              <label style="margin:0">💰 接受付费请教（不想交换也可收费）</label>
              <span class="switch"><input type="checkbox" name="teachPaid" /><span class="slider"></span></span>
            </div>
          </div>
        </div>

        <div class="form-panel learn">
          <div class="panel-head">🍇 我想学的</div>
          <div class="panel-body">
            <div class="field" data-req>
              <label>技能名称 *</label>
              <input type="text" name="learnTitle" placeholder="如：视频剪辑 / 英语口语" maxlength="20" />
              <div class="err">请填写技能名称</div>
            </div>
            <div class="field" data-req>
              <label>分类 *</label>
              <select name="learnCat"><option value="">请选择分类</option>${CATEGORIES.map((c) => `<option>${c}</option>`).join("")}</select>
              <div class="err">请选择分类</div>
            </div>
            <div class="field">
              <label>期望达到程度</label>
              <div class="range-row">
                <input type="range" name="learnLevel" min="0" max="3" value="1" />
                <span class="range-val" data-for="learnLevel">${LEVELS[1]}</span>
              </div>
            </div>
            <div class="field">
              <label>学习形式</label>
              <select name="learnMode"><option>线上</option><option>线下</option><option>均可</option></select>
            </div>
            <div class="field">
              <label>学习目标（选填）</label>
              <textarea name="learnDesc" placeholder="为什么想学？希望多久学会？" maxlength="120"></textarea>
            </div>
            <div class="field">
              <label>想用来交换的技能（选填）</label>
              <input type="text" name="learnWant" placeholder="默认用左侧「我能教的」交换" maxlength="20" />
            </div>
          </div>
        </div>
      </div>
      <div class="publish-submit">
        <button type="submit" class="btn btn-grad">🚀 发布并立即匹配</button>
      </div>
    </form>
  </div>`;

  $$('input[type="range"]', el).forEach((r) =>
    r.addEventListener("input", () => { $(`[data-for="${r.name}"]`, el).textContent = LEVELS[+r.value]; }));

  $("#publishForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    let ok = true;
    $$(".field[data-req]", f).forEach((fd) => {
      const inp = $("input,select,textarea", fd);
      const valid = inp.value.trim() !== "";
      fd.classList.toggle("invalid", !valid);
      if (!valid) ok = false;
    });
    if (!ok) { toast("请完善必填项（标 * 的字段）", "error"); return; }

    const fd = new FormData(f);
    const teachTitle = fd.get("teachTitle").trim();
    Store.addSkill({
      userId: ME_ID, type: "teach",
      title: teachTitle, category: fd.get("teachCat"),
      level: +fd.get("teachLevel"), mode: fd.get("teachMode"),
      desc: fd.get("teachDesc").trim() || "这位同学很酷，什么都没写。",
      want: fd.get("learnTitle").trim(), paid: fd.get("teachPaid") === "on"
    });
    Store.addSkill({
      userId: ME_ID, type: "learn",
      title: fd.get("learnTitle").trim(), category: fd.get("learnCat"),
      level: +fd.get("learnLevel"), mode: fd.get("learnMode"),
      desc: fd.get("learnDesc").trim(), want: fd.get("learnWant").trim() || teachTitle, paid: false
    });
    confetti(100);
    toast("发布成功！正在为你寻找匹配…", "success");
    setTimeout(() => (location.hash = "#/match"), 900);
  });
}

/* ================= 匹配引擎 ================= */
const titleEq = (a, b) => { const x = norm(a), y = norm(b); return x && y && (x === y || x.includes(y) || y.includes(x)); };

function computeMatches() {
  const myTeach = Store.teachSkills(ME_ID);
  const myLearn = Store.learnSkills(ME_ID);
  if (!myTeach.length && !myLearn.length) return [];

  const results = [];
  Store.data.users.filter((u) => u.id !== ME_ID).forEach((u) => {
    const theyTeach = Store.teachSkills(u.id);
    const theyLearn = Store.learnSkills(u.id);
    // 我教的 ∈ TA 想学的
    const give = myTeach.find((s) => theyLearn.some((t) => titleEq(s.title, t.title) || s.category === t.category && titleEq(s.title, t.title)));
    // 我想学的 ∈ TA 能教的
    const take = myLearn.find((s) => theyTeach.some((t) => titleEq(s.title, t.title) || s.category === t.category && titleEq(s.title, t.title)));
    // 同分类弱匹配（没有精确命中时兜底）
    const giveWeak = give || myTeach.find((s) => theyLearn.some((t) => s.category === t.category));
    const takeWeak = take || myLearn.find((s) => theyTeach.some((t) => s.category === t.category));
    if (!giveWeak && !takeWeak) return;

    const perfect = Boolean(give && take);
    let score = perfect ? 100 : (give || take ? 60 : 45);
    if (!perfect && giveWeak && takeWeak) score += 15;               // 双向同分类
    else if (giveWeak !== give || takeWeak !== take) score += 10;    // 单侧同分类加成
    score = Math.min(100, score + Math.round(u.credit / 50));        // 信用加权

    results.push({
      user: u, score, perfect: perfect || (Boolean(giveWeak) && Boolean(takeWeak) && score >= 90),
      give: (give || giveWeak), take: (take || takeWeak)
    });
  });
  return results.sort((a, b) => b.score - a.score || b.user.credit - a.user.credit);
}

/* ================= 视图：智能匹配 ================= */
function ringHtml(score, perfect) {
  const R = 34, C = 2 * Math.PI * R;
  const color = perfect ? "url(#gradGold)" : "url(#gradMain)";
  return `
  <div class="ring">
    <svg width="84" height="84" viewBox="0 0 84 84">
      <defs>
        <linearGradient id="gradMain" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#7C3AED"/><stop offset="100%" stop-color="#F97316"/>
        </linearGradient>
        <linearGradient id="gradGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#EAB308"/><stop offset="100%" stop-color="#F97316"/>
        </linearGradient>
      </defs>
      <circle class="ring-bg" cx="42" cy="42" r="${R}" fill="none" stroke-width="8"/>
      <circle class="ring-fg" cx="42" cy="42" r="${R}" fill="none" stroke-width="8"
        stroke="${color}" stroke-dasharray="${C}" stroke-dashoffset="${C}"/>
    </svg>
    <div class="ring-num">${score}<small>%</small></div>
  </div>`;
}

function renderMatch() {
  const el = $("#view-match");
  const myTeach = Store.teachSkills(ME_ID);
  const myLearn = Store.learnSkills(ME_ID);

  if (!myTeach.length && !myLearn.length) {
    el.innerHTML = `
    <div class="section wrap" style="max-width:860px">
      <div class="empty-state">
        <span class="big">🧭</span>
        你还没有发布技能，匹配引擎需要知道「你能教什么」和「你想学什么」。<br /><br />
        <a class="btn btn-grad" href="#/publish">去发布我的技能</a>
      </div>
    </div>`;
    return;
  }

  const matches = computeMatches();
  el.innerHTML = `
  <div class="section wrap" style="max-width:960px">
    <div class="match-banner">
      <span class="icon">⇄</span>
      <div>
        <b>双向智能匹配</b><br />
        <small>「我教的 = TA 想学的」且「我学的 = TA 能教的」为完美匹配，金色描边置顶；单向匹配与同分类兴趣次之。</small>
      </div>
    </div>
    ${matches.length ? `<div class="match-list">${matches.map((m) => {
      const u = m.user;
      const already = Store.data.requests.some((r) =>
        r.from === ME_ID && r.to === u.id && ["pending", "accepted"].includes(r.status));
      return `
      <div class="match-card ${m.perfect ? "perfect" : ""}">
        ${ringHtml(m.score, m.perfect)}
        <div class="match-mid">
          <div class="match-user">
            ${avatarHtml(u)} <b>${esc(u.name)}</b> ${badgeMini(u)}
            <span class="owner-credit">信用 ${u.credit} 分</span>
          </div>
          <div class="swap-diagram">
            <span class="swap-node">我教 · ${esc(m.give ? m.give.title : "—")}</span>
            <span class="swap-arrow">⇄</span>
            <span class="swap-node them">TA 教 · ${esc(m.take ? m.take.title : "—")}</span>
          </div>
          <div class="match-tags">
            ${m.perfect ? `<span class="match-tag gold">✨ 完美双向匹配</span>` : `<span class="match-tag">单向匹配</span>`}
            ${m.give && m.give.paid ? `<span class="match-tag">💰 TA 接受付费请教</span>` : ""}
            ${m.take ? `<span class="match-tag">${esc(m.take.mode)}授课</span>` : ""}
          </div>
        </div>
        <div class="match-actions">
          <button class="btn btn-grad btn-sm" data-action="contract" data-user="${u.id}"
            data-give="${esc(m.give ? m.give.title : "")}" data-take="${esc(m.take ? m.take.title : "")}"
            ${already ? "disabled" : ""}>${already ? "已发起交换" : "发起交换"}</button>
          <button class="btn btn-outline btn-sm" data-action="viewUser" data-user="${u.id}">查看 TA 的主页</button>
        </div>
      </div>`;
    }).join("")}</div>`
    : `<div class="empty-state"><span class="big">🛰️</span>暂时没有匹配到伙伴，换个技能方向试试？<br /><br /><a class="btn btn-grad" href="#/publish">再发布一个技能</a></div>`}
  </div>`;

  // 环形进度动画
  requestAnimationFrame(() => $$(".ring-fg", el).forEach((c, i) => {
    const C = 2 * Math.PI * 34;
    c.style.strokeDashoffset = C * (1 - matches[i].score / 100);
  }));
}

/* ================= 模态框 ================= */
function openModal(html) {
  const root = $("#modal-root");
  root.innerHTML = `<div class="modal-mask" data-close><div class="modal-card">${html}</div></div>`;
  $(".modal-mask", root).addEventListener("click", (e) => { if (e.target.dataset.close !== undefined && e.target === e.currentTarget) closeModal(); });
}
function closeModal() { $("#modal-root").innerHTML = ""; }

/* ---- 交换契约模态框 ---- */
function openContractModal(userId, give, take) {
  const u = Store.user(userId);
  openModal(`
    <div class="modal-head">📜 签订交换契约 <button data-x>✕</button></div>
    <div class="modal-body">
      <div class="swap-diagram">
        <span class="swap-node">我教 · ${esc(give)}</span>
        <span class="swap-arrow">⇄</span>
        <span class="swap-node them">${esc(u.name)} 教 · ${esc(take)}</span>
      </div>
      <div class="field"><label>交换形式</label>
        <select id="ctForm"><option>线上 · 视频/语音</option><option>线下 · 咖啡馆/自习室</option><option>线上 + 线下混合</option></select>
      </div>
      <div class="field"><label>交换周期</label>
        <select id="ctPeriod"><option>1 周速成</option><option>2 周</option><option selected>1 个月</option><option>长期互助</option></select>
      </div>
      <div class="field"><label>给 TA 捎句话</label>
        <textarea id="ctNote" placeholder="约定一下时间安排与学习目标，能大大降低爽约率哦" maxlength="100"></textarea>
      </div>
      <button class="btn btn-grad" id="ctSubmit">🤝 发送交换请求</button>
      <small style="color:var(--ink-sub);text-align:center">契约达成后爽约将扣除 ${-CREDIT_RULES.noShow} 信用分</small>
    </div>`);
  $("[data-x]").addEventListener("click", closeModal);
  $("#ctSubmit").addEventListener("click", () => {
    Store.addRequest({
      from: ME_ID, to: userId,
      fromSkill: give, toSkill: take,
      form: $("#ctForm").value, period: $("#ctPeriod").value,
      note: $("#ctNote").value.trim()
    });
    closeModal();
    confetti(60);
    toast(`已向 ${u.name} 发送交换请求`, "success");
    refreshBadge();
    if (location.hash.includes("match")) renderMatch();
  });
}

/* ---- 互评模态框 ---- */
function openReviewModal(reqId) {
  const r = Store.request(reqId);
  const otherId = r.from === ME_ID ? r.to : r.from;
  const u = Store.user(otherId);
  let stars = 5;
  openModal(`
    <div class="modal-head">⭐ 评价这次交换 <button data-x>✕</button></div>
    <div class="modal-body">
      <p style="text-align:center">与 <b>${esc(u.name)}</b> 的「${esc(r.from === ME_ID ? r.toSkill : r.fromSkill)}」交换体验如何？</p>
      <div class="star-input" id="starInput">
        ${[1, 2, 3, 4, 5].map((i) => `<button data-star="${i}" class="on">★</button>`).join("")}
      </div>
      <div class="field"><label>评语</label>
        <textarea id="rvText" placeholder="说说 TA 的教学态度、专业度…" maxlength="120"></textarea>
      </div>
      <button class="btn btn-grad" id="rvSubmit">提交评价（好评为 TA +${CREDIT_RULES.goodReview} 分）</button>
    </div>`);
  $("[data-x]").addEventListener("click", closeModal);
  $$("#starInput button").forEach((b) => b.addEventListener("click", () => {
    stars = +b.dataset.star;
    $$("#starInput button").forEach((x) => x.classList.toggle("on", +x.dataset.star <= stars));
  }));
  $("#rvSubmit").addEventListener("click", () => {
    Store.addReview({ from: ME_ID, to: otherId, stars, text: $("#rvText").value.trim() || "一次愉快的技能交换！", reqId });
    if (stars >= 4) Store.addCredit(otherId, CREDIT_RULES.goodReview, "收到好评");
    closeModal();
    confetti(50);
    toast("评价成功，感谢反馈！", "success");
    renderMe();
  });
}

/* ---- 用户主页模态框 ---- */
function openUserModal(userId) {
  const u = Store.user(userId);
  const teach = Store.teachSkills(userId);
  const reviews = Store.reviewsOf(userId).slice(0, 3);
  openModal(`
    <div class="modal-head">${esc(u.avatar)} ${esc(u.name)} 的主页 <button data-x>✕</button></div>
    <div class="modal-body">
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        ${badgeMini(u)} <span class="owner-credit">信用 ${u.credit} 分 · 完成交换 ${Store.data.requests.filter((r) => (r.from === userId || r.to === userId) && r.status === "completed").length} 次</span>
      </div>
      <div>
        <b style="font-size:14px">TA 能教的</b>
        ${teach.map((s) => `<div class="my-skill-row" style="margin-top:8px"><span><span class="cat-pill" style="background:${catColor(s.category)}">${esc(s.category)}</span> <b>${esc(s.title)}</b> ${levelDots(s.level)}</span><span class="mode-pill">${esc(s.mode)}</span></div>`).join("")}
      </div>
      <div>
        <b style="font-size:14px">收到的评价</b>
        ${reviews.length ? reviews.map((rv) => `
          <div class="review-item">
            <span class="stars">${"★".repeat(rv.stars)}${"☆".repeat(5 - rv.stars)}</span>
            <p class="review-text">${esc(rv.text)}</p>
            <p class="review-from">—— ${esc(Store.user(rv.from).name)}</p>
          </div>`).join("") : `<p class="review-text" style="margin-top:8px">还没有收到评价</p>`}
      </div>
    </div>`);
  $("[data-x]").addEventListener("click", closeModal);
}

/* ================= 视图：我的 ================= */
const meState = { tab: "received" };
function statusLabel(s) {
  return { pending: "待处理", accepted: "进行中", rejected: "已拒绝", completed: "已完成", cancelled: "已爽约" }[s] || s;
}
function renderMe() {
  const el = $("#view-me");
  const me = Store.me();
  const mySkills = Store.data.skills.filter((s) => s.userId === ME_ID);
  const myReviews = Store.reviewsOf(ME_ID);
  const nextBadge = BADGES.find((b) => me.credit < b.min);
  const pct = nextBadge ? Math.round((me.credit / nextBadge.min) * 100) : 100;

  const reqs = Store.data.requests
    .filter((r) => (meState.tab === "sent" ? r.from === ME_ID : r.to === ME_ID))
    .sort((a, b) => b.createdAt - a.createdAt);

  el.innerHTML = `
  <div class="section wrap">
    <div class="me-grid">
      <aside class="profile-card">
        <div class="profile-hero">
          <span class="avatar">${esc(me.avatar)}</span>
          <h3>${esc(me.name)}</h3>
          <small style="opacity:.8">技换第 1024 位居民</small>
        </div>
        <div class="profile-body">
          <div class="credit-box">
            <div class="credit-top"><span>信用分</span><b>${me.credit}</b></div>
            <div class="progress"><i style="width:${pct}%"></i></div>
            <small style="color:var(--ink-sub)">
              ${nextBadge ? `再获 ${nextBadge.min - me.credit} 分解锁「${nextBadge.icon} ${nextBadge.name}」` : "已达最高徽章等级 🎉"}
            </small>
          </div>
          <div class="badge-wall">
            ${BADGES.map((b) => `<span class="badge-item ${me.credit >= b.min ? "" : "locked"}" title="${b.desc}">${b.icon} ${b.name}</span>`).join("")}
          </div>
        </div>
      </aside>

      <div>
        <div class="panel">
          <h3>📦 我发布的技能（${mySkills.length}）</h3>
          ${mySkills.length ? mySkills.map((s) => `
            <div class="my-skill-row">
              <span>
                <span class="cat-pill" style="background:${s.type === "teach" ? catColor(s.category) : "#6B6580"}">${s.type === "teach" ? "能教" : "想学"}</span>
                <b>${esc(s.title)}</b> ${s.type === "teach" ? levelDots(s.level) : ""}
              </span>
              <button class="btn btn-danger btn-sm" data-action="delSkill" data-skill="${s.id}">删除</button>
            </div>`).join("")
          : `<p class="review-text">还没有发布技能，<a href="#/publish" style="color:var(--violet);font-weight:700">去发布</a></p>`}
        </div>

        <div class="panel">
          <h3>⇄ 交换请求</h3>
          <div class="sub-tabs">
            <button class="sub-tab ${meState.tab === "received" ? "active" : ""}" data-tab="received">我收到的（${Store.data.requests.filter((r) => r.to === ME_ID).length}）</button>
            <button class="sub-tab ${meState.tab === "sent" ? "active" : ""}" data-tab="sent">我发起的（${Store.data.requests.filter((r) => r.from === ME_ID).length}）</button>
          </div>
          ${reqs.length ? reqs.map((r) => {
            const other = Store.user(r.from === ME_ID ? r.to : r.from);
            const incoming = r.to === ME_ID;
            const reviewed = Store.data.reviews.some((rv) => rv.reqId === r.id && rv.from === ME_ID);
            return `
            <div class="req-item">
              <div class="req-info">
                <span class="who">${incoming ? `${esc(other.name)} 想和你交换` : `你想和 ${esc(other.name)} 交换`}</span>
                <span class="status-pill ${r.status}" style="margin-left:8px">${statusLabel(r.status)}</span>
                <div class="contract">
                  📜 我教「${esc(incoming ? r.toSkill : r.fromSkill)}」 ⇄ TA 教「${esc(incoming ? r.fromSkill : r.toSkill)}」<br />
                  ${esc(r.form)} · 周期 ${esc(r.period)}${r.note ? `<br />💬 ${esc(r.note)}` : ""}
                </div>
                <div class="req-ops">
                  ${incoming && r.status === "pending" ? `
                    <button class="btn btn-grad btn-sm" data-action="accept" data-req="${r.id}">接受契约</button>
                    <button class="btn btn-danger btn-sm" data-action="reject" data-req="${r.id}">拒绝</button>` : ""}
                  ${r.status === "accepted" ? `
                    <button class="btn btn-grad btn-sm" data-action="complete" data-req="${r.id}">完成交换</button>
                    <button class="btn btn-danger btn-sm" data-action="noshow" data-req="${r.id}">爽约取消</button>` : ""}
                  ${r.status === "completed" && !reviewed ? `
                    <button class="btn btn-outline btn-sm" data-action="review" data-req="${r.id}">评价 TA</button>` : ""}
                </div>
              </div>
            </div>`;
          }).join("") : `<p class="review-text">暂无${meState.tab === "received" ? "收到" : "发起"}的交换请求</p>`}
        </div>

        <div class="panel">
          <h3>⭐ 收到的评价（${myReviews.length}）</h3>
          ${myReviews.length ? myReviews.map((rv) => `
            <div class="review-item">
              <span class="stars">${"★".repeat(rv.stars)}${"☆".repeat(5 - rv.stars)}</span>
              <p class="review-text">${esc(rv.text)}</p>
              <p class="review-from">—— ${esc(Store.user(rv.from).name)} · ${new Date(rv.createdAt).toLocaleDateString("zh-CN")}</p>
            </div>`).join("")
          : `<p class="review-text">完成一次交换后，就能收到来自伙伴的评价啦</p>`}
        </div>
      </div>
    </div>
  </div>`;

  $$(".sub-tab", el).forEach((b) => b.addEventListener("click", () => { meState.tab = b.dataset.tab; renderMe(); }));
}

/* ================= 全局事件委托 ================= */
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-action],[data-goto]");
  if (!t) return;
  const act = t.dataset.action;
  if (t.dataset.goto) { plazaState.cat = t.dataset.cat || "全部"; plazaState.kw = ""; location.hash = "#/plaza"; return; }

  switch (act) {
    case "swap": {
      const s = Store.data.skills.find((x) => x.id === t.dataset.skill);
      const myTeach = Store.teachSkills(ME_ID);
      if (!myTeach.length) { toast("请先在「发布技能」中填写你能教的内容", "error"); location.hash = "#/publish"; return; }
      openContractModal(s.userId, myTeach[0].title, s.title);
      break;
    }
    case "contract": openContractModal(t.dataset.user, t.dataset.give, t.dataset.take); break;
    case "viewUser":  openUserModal(t.dataset.user); break;
    case "delSkill":
      Store.removeSkill(t.dataset.skill);
      toast("已删除该技能");
      renderMe(); break;
    case "accept": {
      Store.setRequestStatus(t.dataset.req, "accepted");
      confetti(50); toast("契约达成！记得按时赴约", "success");
      refreshBadge(); renderMe(); break;
    }
    case "reject":
      Store.setRequestStatus(t.dataset.req, "rejected");
      toast("已拒绝该请求"); refreshBadge(); renderMe(); break;
    case "complete": {
      const r = Store.setRequestStatus(t.dataset.req, "completed");
      Store.addCredit(ME_ID, CREDIT_RULES.complete, "完成交换");
      Store.addCredit(r.from === ME_ID ? r.to : r.from, CREDIT_RULES.complete, "完成交换");
      Store.data.exchangesDone++; Store.save();
      confetti(90);
      refreshBadge(); renderMe();
      setTimeout(() => openReviewModal(r.id), 600);
      break;
    }
    case "noshow":
      Store.setRequestStatus(t.dataset.req, "cancelled");
      Store.addCredit(ME_ID, CREDIT_RULES.noShow, "爽约扣除");
      toast("契约已取消，信用分已扣除", "error");
      refreshBadge(); renderMe(); break;
    case "review": openReviewModal(t.dataset.req); break;
  }
});

/* ================= 路由 ================= */
const ROUTES = { home: renderHome, plaza: renderPlaza, publish: renderPublish, match: renderMatch, me: renderMe };
function currentRoute() {
  const h = location.hash.replace(/^#\/?/, "");
  return ROUTES[h] ? h : "home";
}
function render() {
  const r = currentRoute();
  $$(".view").forEach((v) => (v.hidden = v.id !== `view-${r}`));
  ROUTES[r]();
  $$("#navTabs a, #bottomTabs a").forEach((a) => a.classList.toggle("active", a.dataset.route === r));
  moveInk();
  window.scrollTo({ top: 0 });
}
function moveInk() {
  const ink = $("#navInk");
  const active = $("#navTabs a.active");
  if (ink && active) { ink.style.left = active.offsetLeft + "px"; ink.style.width = active.offsetWidth + "px"; }
}
function refreshBadge() {
  const n = Store.pendingReceivedCount();
  const b1 = $("#navBadge"), b2 = $("#navBadgeM");
  b1.hidden = n === 0; b1.textContent = n;
  b2.hidden = n === 0;
}

/* ================= 启动 ================= */
Store.load();
window.addEventListener("hashchange", render);
window.addEventListener("resize", moveInk);
if (!location.hash) location.hash = "#/home";
render();
refreshBadge();
