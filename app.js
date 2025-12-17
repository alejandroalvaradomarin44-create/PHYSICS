const state = { problems: [], filtered: [] };
const el = (id) => document.getElementById(id);

function normalize(s) { return (s || "").toLowerCase().trim(); }

function uniqueValues(problems, key) {
  const set = new Set(problems.map(p => p[key]).filter(Boolean));
  return ["all", ...Array.from(set).sort((a,b)=>a.localeCompare(b))];
}

function fillSelect(selectEl, values, labelAll) {
  selectEl.innerHTML = values.map(v => {
    const label = (v === "all") ? labelAll : v;
    return `<option value="${v}">${label}</option>`;
  }).join("");
}

function applyFilters() {
  const q = normalize(el("search").value);
  const topic = el("topic").value;
  const diff = el("difficulty").value;

  state.filtered = state.problems.filter(p => {
    const haystack = [
      p.title, p.topic, p.difficulty, p.goal, p.explanation, p.why,
      (p.tags || []).join(" ")
    ].map(normalize).join(" • ");

    const matchesText = !q || haystack.includes(q);
    const matchesTopic = topic === "all" || p.topic === topic;
    const matchesDiff = diff === "all" || p.difficulty === diff;

    return matchesText && matchesTopic && matchesDiff;
  });

  renderCards();
}

function cardHTML(p) {
  const tags = (p.tags || []).slice(0, 3).map(t => `<span class="pill">#${t}</span>`).join("");
  return `
    <article class="card" tabindex="0" data-id="${p.id}">
      <img class="thumb" src="${p.image}" alt="${p.alt}" loading="lazy" />
      <h3>${p.title}</h3>
      <div class="meta">
        <span class="pill">${p.topic || "—"}</span>
        <span class="pill">${p.difficulty || "—"}</span>
        <span class="pill">${p.time || "—"}</span>
      </div>
      <div class="meta">${tags}</div>
    </article>
  `;
}

function renderCards() {
  const cards = el("cards");
  if (state.filtered.length === 0) {
    cards.innerHTML = `<p class="note">No matches. Try a different keyword or set filters to “All”.</p>`;
    return;
  }

  cards.innerHTML = state.filtered.map(cardHTML).join("");

  cards.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => openModal(card.dataset.id));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openModal(card.dataset.id);
    });
  });
}

function openModal(id) {
  const p = state.problems.find(x => String(x.id) === String(id));
  if (!p) return;

  el("modalTitle").textContent = p.title;
  const img = el("modalImg");
  img.src = p.image;
  img.alt = p.alt;

  el("modalGoal").textContent = p.goal || "—";
  el("modalExplanation").textContent = p.explanation || "—";
  el("modalWhy").textContent = p.why || "—";

  const tags = (p.tags || []).map(t => `<span class="pill">#${t}</span>`).join("");
  el("modalTags").innerHTML = `
    <span class="pill">${p.topic || "—"}</span>
    <span class="pill">${p.difficulty || "—"}</span>
    ${tags}
  `;

  el("backdrop").hidden = false;
  el("modal").hidden = false;
  el("closeBtn").focus();
}

function closeModal() {
  el("backdrop").hidden = true;
  el("modal").hidden = true;
}

async function init() {
  el("year").textContent = new Date().getFullYear();

  const res = await fetch("problems.json");
  state.problems = await res.json();
  state.filtered = [...state.problems];

  fillSelect(el("topic"), uniqueValues(state.problems, "topic"), "All topics");
  fillSelect(el("difficulty"), uniqueValues(state.problems, "difficulty"), "All levels");

  el("search").addEventListener("input", applyFilters);
  el("topic").addEventListener("change", applyFilters);
  el("difficulty").addEventListener("change", applyFilters);

  el("closeBtn").addEventListener("click", closeModal);
  el("backdrop").addEventListener("click", closeModal);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !el("modal").hidden) closeModal();
  });

  renderCards();
}

init();
