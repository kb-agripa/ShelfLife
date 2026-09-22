/* ShelfLife prototype logic. Vanilla JS, no build step.
   State lives in memory and is written to localStorage on every change.
   Functions are global because the markup calls them from inline handlers. */

const STORAGE_KEY = "shelflife_items_v2";
const HISTORY_KEY = "shelflife_history_v2";
const AUTH_KEY = "shelflife_auth_user";
const THEME_KEY = "shelflife_theme";

const CATEGORIES = {
  fridge: "Fridge",
  pantry: "Pantry",
  medicine: "Medicine",
  cosmetics: "Cosmetics",
  gobag: "Go-bag",
};

/* History actions and the status colour each one borrows. */
const ACTION_TIER = {
  Consumed: "good",
  Rotated: "good",
  Discarded: "critical",
  Removed: "expired",
};

let currentCategory = "all";
let currentHistoryFilter = "all";
let currentAuthUser = readJSON(AUTH_KEY, null);
let undoSnapshot = null;

/* ---------- Dates. The app is date-only and works in local time. ---------- */

function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isoDaysFromNow(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return toISODate(d);
}

function hoursAgo(h) {
  return new Date(Date.now() - h * 3600000).toISOString();
}

function daysUntil(dateStr) {
  const [y, m, d] = String(dateStr).split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / 86400000);
}

/* Status tiers: Expired (< 0), Use today (0), Urgent (1 to 3), Soon (4 to 7), Good (8+) */
function tierFor(days) {
  if (days < 0) return { tier: "expired", label: "Expired" };
  if (days === 0) return { tier: "critical", label: "Use today" };
  if (days <= 3) return { tier: "urgent", label: "Urgent" };
  if (days <= 7) return { tier: "soon", label: "Soon" };
  return { tier: "good", label: "Good" };
}

/* ---------- Demo data ---------- */

function sampleItems() {
  return [
    { id: "1", name: "Water purification tablets (50 pack)", category: "gobag", date: isoDaysFromNow(180) },
    { id: "2", name: "Canned tuna in oil", category: "gobag", date: isoDaysFromNow(5) },
    { id: "3", name: "Fresh whole milk, 1 L", category: "fridge", date: isoDaysFromNow(2) },
    { id: "4", name: "Sourdough loaf", category: "pantry", date: isoDaysFromNow(0) },
    { id: "5", name: "Greek yogurt cup", category: "fridge", date: isoDaysFromNow(-2) },
    { id: "6", name: "Flashlight batteries (AA)", category: "gobag", date: isoDaysFromNow(90) },
  ];
}

function sampleHistory() {
  return [
    { id: "h1", name: "Wheat bread", category: "pantry", date: isoDaysFromNow(-4), action: "Consumed", note: "", loggedAt: hoursAgo(26) },
    { id: "h2", name: "Cheddar cheese", category: "fridge", date: isoDaysFromNow(-8), action: "Discarded", note: "expired", loggedAt: hoursAgo(5 * 24 + 3) },
    { id: "h3", name: "Duplicate milk entry", category: "fridge", date: isoDaysFromNow(3), action: "Removed", note: "", loggedAt: hoursAgo(6 * 24 + 7) },
  ];
}

/* ---------- Storage ---------- */

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error(e);
    return fallback;
  }
}

let items = readJSON(STORAGE_KEY, null) || sampleItems();
let history = readJSON(HISTORY_KEY, null) || sampleHistory();

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  renderAll();
}

/* Every destructive action snapshots both lists first so the toast can undo it. */
function snapshot() {
  undoSnapshot = { items: items.slice(), history: history.slice() };
}

function undo() {
  if (!undoSnapshot) return;
  items = undoSnapshot.items;
  history = undoSnapshot.history;
  undoSnapshot = null;
  persist();
  showToast("Undone");
}

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* ---------- Rendering ---------- */

function renderAll() {
  renderNextUp();
  renderItems();
  renderHistory();
}

function daysMarkup(days) {
  const n = Math.abs(days);
  const unit = n === 1 ? "day" : "days";
  const suffix = days < 0 ? "ago" : "left";
  return `<div class="days"><span class="days-n">${n}</span><span class="days-l">${unit} ${suffix}</span></div>`;
}

function emptyMarkup(title, body) {
  return `<li class="empty"><strong>${title}</strong><span>${body}</span></li>`;
}

function countLabel(n, singular, plural) {
  return `${n} ${n === 1 ? singular : plural}`;
}

/* Hero panel: the three items with the fewest days left. */
function renderNextUp() {
  const list = document.getElementById("nextUpList");
  const foot = document.getElementById("nextUpFoot");
  const dateEl = document.getElementById("nextUpDate");
  if (!list) return;

  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString("en-PH", { month: "short", day: "numeric" });
    dateEl.dateTime = isoDaysFromNow(0);
  }

  const soonest = items
    .map((item) => ({ ...item, days: daysUntil(item.date) }))
    .sort((a, b) => a.days - b.days)
    .slice(0, 3);

  if (soonest.length === 0) {
    list.innerHTML = `<li class="next-up-empty">Nothing tracked yet. Add an item in the tracker.</li>`;
    if (foot) foot.textContent = "";
    return;
  }

  list.innerHTML = soonest
    .map((item) => {
      const status = tierFor(item.days);
      return `
        <li class="tier-${status.tier}">
          ${daysMarkup(item.days)}
          <div class="row-main">
            <div class="row-name">${escapeHtml(item.name)}</div>
            <div class="row-meta">
              <span>${categoryLabel(item.category)}</span>
              <span class="badge">${status.label}</span>
            </div>
          </div>
        </li>`;
    })
    .join("");

  if (foot) foot.textContent = `${countLabel(items.length, "item", "items")} tracked`;
}

function renderItems() {
  const container = document.getElementById("itemsContainer");
  if (!container) return;

  const search = (document.getElementById("searchInput")?.value || "").trim().toLowerCase();
  const sortBy = document.getElementById("sortSelect")?.value || "urgency";

  const visible = items
    .map((item) => ({ ...item, days: daysUntil(item.date) }))
    .filter((item) => {
      if (search && !item.name.toLowerCase().includes(search)) return false;
      if (currentCategory === "all") return true;
      if (currentCategory === "critical") return item.days <= 3;
      return item.category === currentCategory;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "category") return a.category.localeCompare(b.category) || a.days - b.days;
      return a.days - b.days;
    });

  if (visible.length === 0) {
    container.innerHTML =
      items.length === 0
        ? emptyMarkup("Nothing tracked yet", "Add an item with the button above.")
        : emptyMarkup("No items match", "Try another filter or clear the search.");
  } else {
    container.innerHTML = visible.map(itemRow).join("");
  }

  const summary = document.getElementById("itemsSummaryCount");
  if (summary) {
    const shown = visible.length !== items.length ? `, ${visible.length} shown` : "";
    summary.textContent = countLabel(items.length, "item", "items") + shown;
  }
}

function itemRow(item) {
  const status = tierFor(item.days);
  const isGoBag = item.category === "gobag";
  const name = escapeHtml(item.name);
  const date = escapeHtml(item.date);
  const primary = isGoBag ? "Mark rotated" : "Mark consumed";
  return `
    <li class="row tier-${status.tier}">
      ${daysMarkup(item.days)}
      <div class="row-main">
        <div class="row-name">${name}</div>
        <div class="row-meta">
          <span class="${isGoBag ? "tag" : ""}">${categoryLabel(item.category)}</span>
          <time class="stamp" datetime="${date}">EXP ${date}</time>
          <span class="badge">${status.label}</span>
        </div>
      </div>
      <div class="row-actions">
        <button type="button" class="btn btn-secondary btn-sm" onclick="consumeItem('${item.id}')" aria-label="${primary}: ${name}">
          ${primary}
        </button>
        <button type="button" class="btn btn-quiet btn-sm" onclick="discardItem('${item.id}')" aria-label="Discard: ${name}">Discard</button>
        <button type="button" class="btn btn-quiet btn-sm" onclick="removeItem('${item.id}')" aria-label="Remove: ${name}">Remove</button>
      </div>
    </li>`;
}

/* Reads a history record's action. Older records stored the note inside the
   action string, for example "Discarded (Expired)" or "Deleted". */
function actionParts(record) {
  const match = /^(\w+)\s*(?:\((.*)\))?$/.exec(record.action || "") || [];
  let verb = match[1] || "Removed";
  if (verb === "Deleted") verb = "Removed";

  let note = record.note || "";
  if (!note && match[2]) {
    const legacy = match[2].toLowerCase();
    if (legacy === "expired") note = "expired";
    if (legacy === "waste") note = "before expiry";
  }
  return { verb, note, tier: ACTION_TIER[verb] || "expired" };
}

function matchesHistoryFilter(record) {
  if (currentHistoryFilter === "all") return true;
  const { verb } = actionParts(record);
  if (currentHistoryFilter === "Consumed") return verb === "Consumed" || verb === "Rotated";
  return verb === currentHistoryFilter;
}

/* Returns markup for the logged time: a <time> when the record has a real timestamp. */
function loggedMarkup(record) {
  if (record.loggedAt) {
    const d = new Date(record.loggedAt);
    if (!Number.isNaN(d.getTime())) {
      const text = d.toLocaleString("en-PH", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
      return `<time datetime="${escapeHtml(record.loggedAt)}">${escapeHtml(text)}</time>`;
    }
  }
  return escapeHtml(record.timestamp || "");
}

function renderHistory() {
  const container = document.getElementById("historyContainer");
  const count = document.getElementById("historyCountBadge");
  if (count) count.textContent = countLabel(history.length, "record", "records");
  if (!container) return;

  const visible = history.filter(matchesHistoryFilter);

  if (visible.length === 0) {
    container.innerHTML =
      history.length === 0
        ? emptyMarkup("No history yet", "Consumed, discarded, and removed items appear here.")
        : emptyMarkup("Nothing in this filter", "Try another filter.");
    return;
  }

  container.innerHTML = visible
    .map((record) => {
      const { verb, note, tier } = actionParts(record);
      const name = escapeHtml(record.name);
      return `
        <li class="row row-log tier-${tier}">
          <div class="row-main">
            <div class="row-name">${name}</div>
            <div class="row-meta">
              <span>${categoryLabel(record.category)}</span>
              <span>Logged ${loggedMarkup(record)}</span>
            </div>
          </div>
          <div class="row-actions">
            <span class="badge">${verb}${note ? `, ${note}` : ""}</span>
            <button type="button" class="btn btn-quiet btn-sm" onclick="restoreFromHistory('${record.id}')" aria-label="Restore: ${name}">Restore</button>
          </div>
        </li>`;
    })
    .join("");
}

/* ---------- Item actions ---------- */

function logRecord(item, action, note) {
  return {
    id: "h_" + newId(),
    name: item.name,
    category: item.category,
    date: item.date,
    action,
    note: note || "",
    loggedAt: new Date().toISOString(),
  };
}

function archiveItem(id, action, note, toastText) {
  const idx = items.findIndex((item) => item.id === id);
  if (idx === -1) return;
  const item = items[idx];
  snapshot();
  items.splice(idx, 1);
  history.unshift(logRecord(item, action, note));
  persist();
  showToast(toastText, { canUndo: true });
}

function consumeItem(id) {
  const item = items.find((entry) => entry.id === id);
  if (!item) return;
  const rotated = item.category === "gobag";
  archiveItem(id, rotated ? "Rotated" : "Consumed", "", `${rotated ? "Marked rotated" : "Marked consumed"}: ${item.name}`);
}

function discardItem(id) {
  const item = items.find((entry) => entry.id === id);
  if (!item) return;
  const expired = daysUntil(item.date) < 0;
  archiveItem(id, "Discarded", expired ? "expired" : "before expiry", `Discarded: ${item.name}`);
}

function removeItem(id) {
  const item = items.find((entry) => entry.id === id);
  if (!item) return;
  archiveItem(id, "Removed", "", `Removed: ${item.name}`);
}

function clearExpired() {
  const expired = items.filter((item) => daysUntil(item.date) < 0);
  if (expired.length === 0) {
    showToast("No expired items to discard");
    return;
  }
  snapshot();
  const records = expired.map((item) => logRecord(item, "Discarded", "expired"));
  items = items.filter((item) => daysUntil(item.date) >= 0);
  history = records.concat(history);
  persist();
  showToast(`Discarded ${countLabel(expired.length, "expired item", "expired items")}`, { canUndo: true });
}

function restoreFromHistory(historyId) {
  const idx = history.findIndex((record) => record.id === historyId);
  if (idx === -1) return;
  const record = history[idx];
  snapshot();
  items.unshift({
    id: newId(),
    name: record.name,
    category: record.category,
    date: record.date || isoDaysFromNow(7),
  });
  history.splice(idx, 1);
  persist();
  showToast(`Restored: ${record.name}`, { canUndo: true });
}

function clearHistory() {
  if (history.length === 0) {
    showToast("History is already empty");
    return;
  }
  snapshot();
  history = [];
  persist();
  showToast("History cleared", { canUndo: true });
}

function seedSampleData() {
  snapshot();
  items = sampleItems();
  persist();
  showToast("Demo items restored", { canUndo: true });
}

/* ---------- Add item form ---------- */

function handleAddItem(e) {
  e.preventDefault();
  const name = document.getElementById("itemNameInput").value.trim();
  const category = document.getElementById("itemCategorySelect").value;
  const date = document.getElementById("itemDateInput").value;
  if (!name || !date) return;

  items.unshift({ id: newId(), name, category, date });
  persist();
  e.target.reset();
  setDefaultDate();
  toggleAddForm(false);
  showToast(`Added: ${name}`);
}

function toggleAddForm(force) {
  const form = document.getElementById("addItemForm");
  const toggle = document.getElementById("addToggle");
  if (!form || !toggle) return;
  const open = typeof force === "boolean" ? force : form.hidden;
  form.hidden = !open;
  toggle.setAttribute("aria-expanded", String(open));
  if (open) document.getElementById("itemNameInput").focus();
}

function setDefaultDate() {
  const input = document.getElementById("itemDateInput");
  if (!input) return;
  input.value = isoDaysFromNow(7);
}

/* ---------- Filters ---------- */

function pressOnly(btn) {
  btn.parentElement.querySelectorAll(".chip").forEach((chip) => {
    chip.setAttribute("aria-pressed", String(chip === btn));
  });
}

function setCategoryFilter(category, btn) {
  currentCategory = category;
  pressOnly(btn);
  renderItems();
}

function setHistoryFilter(filter, btn) {
  currentHistoryFilter = filter;
  pressOnly(btn);
  renderHistory();
}

/* ---------- Savings estimate (Philippine pesos) ---------- */

function updateCalculator() {
  const familySlider = document.getElementById("familySizeSlider");
  const spendSlider = document.getElementById("spendSlider");
  if (!familySlider || !spendSlider) return;

  const familySize = Number(familySlider.value);
  const weeklySpend = Number(spendSlider.value);

  document.getElementById("familySizeLabel").textContent = countLabel(familySize, "person", "people");
  document.getElementById("spendLabel").textContent = formatPeso(weeklySpend);

  // Illustrative assumptions, stated in the UI: 18% of grocery spend is lost
  // to expired food and 48 kg of avoidable waste per person per year.
  const savings = Math.round(weeklySpend * 52 * 0.18);
  const wasteKg = familySize * 48;

  document.getElementById("annualSavingsVal").textContent = formatPeso(savings);
  document.getElementById("wasteDivertedVal").textContent = `${wasteKg} kg`;
}

function formatPeso(value) {
  return "₱" + value.toLocaleString("en-PH");
}

/* ---------- Toasts ---------- */

function showToast(message, { canUndo = false } = {}) {
  const region = document.getElementById("toastContainer");
  if (!region) return;

  const toast = document.createElement("div");
  toast.className = "toast";

  const text = document.createElement("span");
  text.textContent = message;
  toast.appendChild(text);

  let timer = null;
  const dismiss = () => {
    clearTimeout(timer);
    toast.dataset.leaving = "true";
    setTimeout(() => toast.remove(), 220);
  };

  if (canUndo) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Undo";
    button.onclick = () => {
      undo();
      dismiss();
    };
    toast.appendChild(button);
  }

  region.appendChild(toast);
  timer = setTimeout(dismiss, canUndo ? 6000 : 3200);
}

/* ---------- Demo sign-in (browser only, no server) ---------- */

function openAuthDialog() {
  const dialog = document.getElementById("authDialog");
  if (dialog && !dialog.open) dialog.showModal();
}

function closeAuthDialog() {
  const dialog = document.getElementById("authDialog");
  if (dialog && dialog.open) dialog.close();
}

function handleAuthSubmit(e) {
  e.preventDefault();
  const email = document.getElementById("authEmailInput").value.trim();
  if (!email) return;
  currentAuthUser = { email, name: email.split("@")[0] };
  localStorage.setItem(AUTH_KEY, JSON.stringify(currentAuthUser));
  e.target.reset();
  closeAuthDialog();
  toggleMenu(false);
  renderAuthState();
  showToast(`Signed in as ${currentAuthUser.name} on this device`);
}

function handleSignOut() {
  currentAuthUser = null;
  localStorage.removeItem(AUTH_KEY);
  renderAuthState();
  showToast("Signed out");
}

function renderAuthState() {
  const box = document.getElementById("authContainer");
  if (!box) return;

  if (currentAuthUser) {
    const initial = escapeHtml(currentAuthUser.email.charAt(0).toUpperCase());
    box.innerHTML = `
      <div class="auth-profile">
        <span class="avatar" aria-hidden="true">${initial}</span>
        <span class="auth-email">${escapeHtml(currentAuthUser.email)}</span>
        <button type="button" class="btn btn-quiet btn-sm" onclick="handleSignOut()">Sign out</button>
      </div>`;
  } else {
    box.innerHTML = `<button type="button" class="btn btn-secondary btn-sm" onclick="openAuthDialog()">Sign in</button>`;
  }
}

/* ---------- Phone menu ---------- */

function toggleMenu(force) {
  const menu = document.getElementById("siteMenu");
  const button = document.getElementById("menuToggle");
  if (!menu || !button) return;
  const open = typeof force === "boolean" ? force : !menu.classList.contains("open");
  menu.classList.toggle("open", open);
  button.setAttribute("aria-expanded", String(open));
}

/* ---------- Colour theme (per device) ---------- */

function applyTheme(value) {
  const root = document.documentElement;
  const explicit = value === "light" || value === "dark";
  if (explicit) root.dataset.theme = value;
  else delete root.dataset.theme;
  syncThemeControl();
}

/* Keeps the header control in step with whatever theme the page is showing. */
function syncThemeControl() {
  const current = document.documentElement.dataset.theme || "system";
  document.querySelectorAll("#themeToggle button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.themeValue === current));
  });
}

function setTheme(value) {
  if (value === "light" || value === "dark") localStorage.setItem(THEME_KEY, value);
  else localStorage.removeItem(THEME_KEY);
  applyTheme(value);
}

/* ---------- Helpers ---------- */

function categoryLabel(category) {
  return CATEGORIES[category] || capitalize(String(category));
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

/* ---------- Init ---------- */

document.addEventListener("DOMContentLoaded", () => {
  setDefaultDate();

  const dialog = document.getElementById("authDialog");
  if (dialog) {
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });
  }

  const menu = document.getElementById("siteMenu");
  if (menu) {
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => toggleMenu(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") toggleMenu(false);
    });
  }

  syncThemeControl();
  renderAuthState();
  renderAll();
  updateCalculator();
});
