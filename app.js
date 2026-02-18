// NEON ORBIT | Trend Forecast Blog (Vanilla JS)
// Edit the `posts` array to add your own entries.

const posts = [
  {
    id: "NO-001",
    title: "Chrome Petal Armor",
    date: "2026-03-14",
    year: 2026,
    category: "Silhouettes",
    featured: true,
    signalScore: 86,
    tags: ["chrome", "sculptural", "neo-romance", "runway-to-street"],
    excerpt:
      "Hard shine, soft shape. Metallic petals and ribbed panels mimic flora under a space-lamp, turning romance into protective geometry.",
    body:
      "Key cues:\n• Curved chest plates, petal hems, corset-like seams\n• Reflective finishes (chrome, liquid foil, mirror vinyl)\n• Pair with sheer layers to keep it breathable\n\nWhy now:\nRomance is returning, but it’s armored. People want softness with boundaries. Expect accessory echoes: petal shoulder pieces, mirrored cuffs, and bloom-shaped bags.",
  },
  {
    id: "NO-002",
    title: "Mesh as a Second Skin",
    date: "2026-05-02",
    year: 2026,
    category: "Materials",
    featured: false,
    signalScore: 74,
    tags: ["mesh", "layering", "performance", "sheer"],
    excerpt:
      "Mesh migrates from gym-core into nightlife. It’s function wearing a smoky perfume.",
    body:
      "Key cues:\n• Micro-mesh long sleeves under tanks\n• Gradient sheers, heat-map prints\n• Cutouts framed by elastic binding\n\nStyle recipe:\nMesh + tailored trousers = future office.\nMesh + mini skirt + big jacket = night signal.\n\nWatch:\nSustainable mesh alternatives and recycled poly blends.",
  },
  {
    id: "NO-003",
    title: "Algorithmic Color Blocking",
    date: "2027-01-10",
    year: 2027,
    category: "Color",
    featured: true,
    signalScore: 90,
    tags: ["color", "neon", "contrast", "digital"],
    excerpt:
      "Color combos feel AI-generated: too perfect, too loud, too intentional. Like your outfit got rendered.",
    body:
      "Key cues:\n• Electric cyan + ultraviolet\n• Acid lime accents on neutral shells\n• Hard-edged panels and piping\n\nCultural driver:\nDigital aesthetics bleeding into physical identity. People want to look ‘high resolution.’",
  },
  {
    id: "NO-004",
    title: "Soft-Utility Bags",
    date: "2027-04-08",
    year: 2027,
    category: "Accessories",
    featured: false,
    signalScore: 69,
    tags: ["bags", "utility", "pockets", "everyday"],
    excerpt:
      "Utility, but plush. Multi-pocket silhouettes in pillowy textiles like your bag is a cloud with a job.",
    body:
      "Key cues:\n• Modular attachments, clip-ons, carabiners\n• Puffer textures, soft nylon, padded straps\n• Color: bone, graphite, muted lilac\n\nWhy it sticks:\nWe’re carrying more (tech, wellness, life). Comfort becomes the luxury signal.",
  },
  {
    id: "NO-005",
    title: "Neo-Folk Techwear",
    date: "2028-02-19",
    year: 2028,
    category: "Culture",
    featured: true,
    signalScore: 82,
    tags: ["folk", "techwear", "heritage", "craft"],
    excerpt:
      "Heritage motifs meet technical fabrics: embroidered symbols on waterproof shells, folklore patterns rendered in reflective thread.",
    body:
      "Key cues:\n• Reflective embroidery, laser-cut lace\n• Cloak shapes, wrap closures, braided cords\n• Hybrid footwear: hiking soles with sculptural uppers\n\nSignal:\nCraft becomes futuristic when it’s protected, portable, and re-coded for the present.",
  },
];

// ---------- Helpers ----------
const byId = (id) => document.getElementById(id);

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function unique(arr) {
  return [...new Set(arr)];
}

function normalize(s) {
  return (s || "").toLowerCase().trim();
}

// ---------- Theme ----------
const THEME_KEY = "neon_orbit_theme";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);

  const btn = byId("themeToggle");
  const icon = btn?.querySelector(".btn-icon");
  if (icon) icon.textContent = theme === "light" ? "☼" : "☾";
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") {
    applyTheme(saved);
  } else {
    applyTheme("dark");
  }
}

// ---------- UI Populate ----------
function populateFilters() {
  const categorySelect = byId("categorySelect");
  const yearSelect = byId("yearSelect");

  const categories = unique(posts.map((p) => p.category)).sort();
  const years = unique(posts.map((p) => p.year)).sort((a, b) => a - b);

  for (const c of categories) {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    categorySelect.appendChild(opt);
  }

  for (const y of years) {
    const opt = document.createElement("option");
    opt.value = String(y);
    opt.textContent = String(y);
    yearSelect.appendChild(opt);
  }

  byId("categoryCount").textContent = String(categories.length);
  byId("signalCount").textContent = String(posts.length);

  const last = posts
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.date;

  byId("lastUpdated").textContent = last ? formatDate(last) : "—";

  // Forecast window based on min/max year
  const minY = Math.min(...years);
  const maxY = Math.max(...years);
  byId("forecastWindow").textContent = `${minY} → ${maxY}`;
}

function buildTagCloud() {
  const tagList = byId("tagList");
  tagList.innerHTML = "";

  const allTags = posts.flatMap((p) => p.tags);
  const counts = allTags.reduce((acc, t) => {
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  const top = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([t]) => t);

  for (const t of top) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tag";
    btn.textContent = `#${t}`;
    btn.addEventListener("click", () => {
      byId("searchInput").value = t;
      render();
      byId("postGrid").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    tagList.appendChild(btn);
  }
}

function renderFeatured(filtered) {
  const featuredCard = byId("featuredCard");

  const featured = filtered.find((p) => p.featured) || posts.find((p) => p.featured) || posts[0];

  if (!featured) {
    featuredCard.innerHTML = "";
    return;
  }

  featuredCard.innerHTML = `
    <div class="featured-inner">
      <div class="badge"><span class="spark">✦</span> FEATURED SIGNAL</div>
      <div class="featured-title">${escapeHtml(featured.title)}</div>
      <div class="featured-meta">
        <span>${escapeHtml(featured.category)}</span>
        <span>•</span>
        <span>${escapeHtml(String(featured.year))}</span>
        <span>•</span>
        <span>${escapeHtml(formatDate(featured.date))}</span>
      </div>
      <p class="featured-excerpt">${escapeHtml(featured.excerpt)}</p>
      <div class="tag-row">
        ${featured.tags.map((t) => `<button class="tag" type="button" data-tag="${escapeAttr(t)}">#${escapeHtml(t)}</button>`).join("")}
      </div>
    </div>
  `;

  featuredCard.querySelectorAll("[data-tag]").forEach((el) => {
    el.addEventListener("click", () => {
      byId("searchInput").value = el.getAttribute("data-tag");
      render();
    });
  });
}

function renderPosts(filtered) {
  const grid = byId("postGrid");
  const empty = byId("emptyState");

  grid.innerHTML = "";

  if (!filtered.length) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  for (const p of filtered) {
    const score = clamp(Number(p.signalScore || 0), 0, 100);
    const fillPct = `${score}%`;

    const card = document.createElement("article");
    card.className = "post";
    card.innerHTML = `
      <div class="post-top">
        <span class="chip">${escapeHtml(p.category)}</span>
        <span>${escapeHtml(formatDate(p.date))}</span>
      </div>

      <h4>${escapeHtml(p.title)}</h4>
      <p>${escapeHtml(p.excerpt)}</p>

      <div class="post-footer">
        <div class="score" title="Signal Score">
          <span>Signal</span>
          <div class="bar" aria-hidden="true"><div class="fill" style="width:${fillPct}"></div></div>
          <span>${score}</span>
        </div>
        <a class="link" href="#" data-open="${escapeAttr(p.id)}">Open</a>
      </div>
    `;

    card.querySelector("[data-open]").addEventListener("click", (e) => {
      e.preventDefault();
      openPost(p.id);
    });

    grid.appendChild(card);
  }
}

function getFilters() {
  const q = normalize(byId("searchInput").value);
  const category = byId("categorySelect").value;
  const year = byId("yearSelect").value;
  const featuredOnly = byId("featuredOnly").checked;

  return { q, category, year, featuredOnly };
}

function filterPosts() {
  const { q, category, year, featuredOnly } = getFilters();

  return posts
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter((p) => {
      if (featuredOnly && !p.featured) return false;
      if (category !== "all" && p.category !== category) return false;
      if (year !== "all" && String(p.year) !== String(year)) return false;

      if (!q) return true;

      const hay = normalize(
        [p.title, p.excerpt, p.body, p.category, String(p.year), ...(p.tags || [])].join(" ")
      );

      return hay.includes(q);
    });
}

function render() {
  const filtered = filterPosts();
  renderFeatured(filtered);
  renderPosts(filtered);
}

// ---------- Post Modal (minimal) ----------
function openPost(id) {
  const p = posts.find((x) => x.id === id);
  if (!p) return;

  const existing = document.querySelector(".modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-backdrop" data-close="1"></div>
    <div class="modal-panel" role="dialog" aria-modal="true" aria-label="Post">
      <div class="modal-head">
        <div class="modal-title">${escapeHtml(p.title)}</div>
        <button class="btn btn-ghost" type="button" data-close="1">✕</button>
      </div>

      <div class="modal-meta">
        <span class="chip">${escapeHtml(p.category)}</span>
        <span class="muted">${escapeHtml(String(p.year))}</span>
        <span class="muted">•</span>
        <span class="muted">${escapeHtml(formatDate(p.date))}</span>
        ${p.featured ? `<span class="chip chip-hot">FEATURED</span>` : ""}
      </div>

      <p class="modal-excerpt">${escapeHtml(p.excerpt)}</p>

      <pre class="modal-body">${escapeHtml(p.body)}</pre>

      <div class="modal-tags">
        ${p.tags.map((t) => `<button class="tag" type="button" data-tag="${escapeAttr(t)}">#${escapeHtml(t)}</button>`).join("")}
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelectorAll("[data-close]").forEach((el) =>
    el.addEventListener("click", () => modal.remove())
  );

  modal.querySelectorAll("[data-tag]").forEach((el) => {
    el.addEventListener("click", () => {
      byId("searchInput").value = el.getAttribute("data-tag");
      modal.remove();
      render();
    });
  });

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") modal.remove();
    },
    { once: true }
  );
}

// Modal styles injected here so you only manage 3 files total.
const modalCSS = `
.modal { position: fixed; inset: 0; z-index: 50; }
.modal-backdrop {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(10px);
}
.modal-panel{
  position: relative;
  width: min(860px, calc(100% - 26px));
  margin: 9vh auto;
  border: 1px solid var(--line);
  border-radius: calc(var(--radius) + 8px);
  background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04));
  box-shadow: var(--shadow);
  padding: 14px;
  max-height: 82vh;
  overflow: auto;
}
.modal-head{
  display:flex; align-items:center; justify-content:space-between; gap:12px;
  margin-bottom: 10px;
}
.modal-title{ font-size: 16px; }
.modal-meta{
  display:flex; flex-wrap:wrap; gap:10px; align-items:center;
  color: var(--muted);
  font-size: 12px;
  margin-bottom: 10px;
}
.muted{ color: var(--muted); }
.chip-hot{
  border-color: rgba(251,113,133,0.35);
  background: rgba(251,113,133,0.12);
  color: var(--text);
}
.modal-excerpt{
  color: var(--muted);
  line-height: 1.8;
  font-size: 12px;
  margin: 0 0 10px;
}
.modal-body{
  margin: 0;
  padding: 12px;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.04);
  color: var(--text);
  font-size: 12px;
  line-height: 1.7;
  white-space: pre-wrap;
}
.modal-tags{
  display:flex; flex-wrap:wrap; gap:8px;
  margin-top: 12px;
}
`;

function injectModalStyles() {
  const style = document.createElement("style");
  style.textContent = modalCSS;
  document.head.appendChild(style);
}

// ---------- Security helpers ----------
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(str) {
  return escapeHtml(str).replaceAll("`", "&#096;");
}

// ---------- Events ----------
function wireEvents() {
  ["searchInput", "categorySelect", "yearSelect", "featuredOnly"].forEach((id) => {
    byId(id).addEventListener("input", render);
    byId(id).addEventListener("change", render);
  });

  byId("clearFilters").addEventListener("click", () => {
    byId("searchInput").value = "";
    byId("categorySelect").value = "all";
    byId("yearSelect").value = "all";
    byId("featuredOnly").checked = false;
    render();
  });

  byId("themeToggle").addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(current === "dark" ? "light" : "dark");
  });
}

// ---------- Init ----------
function init() {
  initTheme();
  injectModalStyles();
  populateFilters();
  buildTagCloud();
  wireEvents();
  render();
}

init();
