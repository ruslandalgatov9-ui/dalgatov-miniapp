const tg = window.Telegram ? window.Telegram.WebApp : null;
const API_BASE = window.location.origin;

if (tg) {
  tg.ready();
  tg.expand();
}

const screens = document.querySelectorAll(".screen");
const navButtons = document.querySelectorAll(".nav-btn");

function showScreen(name) {
  screens.forEach((s) => s.classList.toggle("active", s.id === `screen-${name}`));
  navButtons.forEach((b) => b.classList.toggle("active", b.dataset.target === name));

  if (name === "services") loadServices();
  if (name === "portfolio") loadPortfolio();
  if (name === "profile") loadProfile();
}

document.querySelectorAll("[data-target]").forEach((el) => {
  el.addEventListener("click", () => showScreen(el.dataset.target));
});

function getTelegramUser() {
  if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
    return tg.initDataUnsafe.user;
  }
  return null;
}

// ---------- Главная ----------
const currentUser = getTelegramUser();
document.getElementById("user-name").textContent =
  (currentUser && currentUser.first_name) || "гость";

// ---------- Профиль ----------
function loadProfile() {
  const user = getTelegramUser();
  const avatarEl = document.getElementById("profile-avatar");
  const nameEl = document.getElementById("profile-name");
  const usernameEl = document.getElementById("profile-username");
  const idEl = document.getElementById("profile-id");

  if (!user) {
    nameEl.textContent = "Гость (открой через кнопку в Telegram-боте)";
    usernameEl.textContent = "";
    idEl.textContent = "";
    return;
  }

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
  avatarEl.textContent = (user.first_name || "?").charAt(0).toUpperCase();
  nameEl.textContent = fullName || "Без имени";
  usernameEl.textContent = user.username ? `@${user.username}` : "без username";
  idEl.textContent = `ID: ${user.id}`;
}

// ---------- Услуги ----------
async function loadServices() {
  const container = document.getElementById("services-list");
  container.innerHTML = '<div class="loader">Загрузка…</div>';
  try {
    const res = await fetch(`${API_BASE}/api/services`);
    const services = await res.json();
    container.innerHTML = services
      .map(
        (s) => `
      <div class="info-card">
        <div class="info-card-icon">${s.icon}</div>
        <div class="info-card-title">${s.title}</div>
        <div class="info-card-desc">${s.description}</div>
        <button class="btn-secondary" onclick="openLeadFrom(${JSON.stringify(s.title)})">Оставить заявку</button>
      </div>`
      )
      .join("");
  } catch (e) {
    container.innerHTML = '<div class="loader">Не удалось загрузить услуги</div>';
  }
}

// ---------- Портфолио ----------
async function loadPortfolio() {
  const container = document.getElementById("portfolio-list");
  container.innerHTML = '<div class="loader">Загрузка…</div>';
  try {
    const res = await fetch(`${API_BASE}/api/portfolio`);
    const items = await res.json();
    container.innerHTML = items
      .map(
        (p) => `
      <div class="info-card">
        <div class="info-card-icon">${p.icon}</div>
        <div class="info-card-title">${p.title}</div>
        <div class="info-card-desc">${p.description}</div>
      </div>`
      )
      .join("");
  } catch (e) {
    container.innerHTML = '<div class="loader">Не удалось загрузить портфолио</div>';
  }
}

// ---------- AI-помощник ----------
const aiChat = document.getElementById("ai-chat");
const aiInput = document.getElementById("ai-input");
const aiSend = document.getElementById("ai-send");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `ai-msg ${sender}`;
  div.textContent = text;
  aiChat.appendChild(div);
  aiChat.scrollTop = aiChat.scrollHeight;
  return div;
}

async function sendQuestion() {
  const question = aiInput.value.trim();
  if (!question) return;

  addMessage(question, "user");
  aiInput.value = "";

  const user = getTelegramUser();
  const thinkingEl = addMessage("…", "bot");

  try {
    const res = await fetch(`${API_BASE}/api/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        user_id: user ? user.id : null,
      }),
    });
    const data = await res.json();
    thinkingEl.textContent = data.answer || "Не удалось получить ответ";
  } catch (e) {
    thinkingEl.textContent = "Ошибка сети. Попробуйте ещё раз.";
  }
}

aiSend.addEventListener("click", sendQuestion);
aiInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendQuestion();
});

// ---------- Заявка ----------
function openLeadFrom(serviceName) {
  showScreen("lead");
  const msgField = document.getElementById("lead-message");
  if (serviceName) msgField.value = `Интересует услуга: ${serviceName}`;
}

const leadForm = document.getElementById("lead-form");
leadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("lead-name").value.trim();
  const contact = document.getElementById("lead-contact").value.trim();
  const message = document.getElementById("lead-message").value.trim();
  const errorEl = document.getElementById("lead-error");

  errorEl.textContent = "";

  if (!name || !contact) {
    errorEl.textContent = "Заполните имя и контакт";
    return;
  }

  const user = getTelegramUser();

  try {
    const res = await fetch(`${API_BASE}/api/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        contact,
        message,
        user_id: user ? user.id : null,
        username: user ? user.username : null,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.error || "Что-то пошло не так";
      return;
    }

    leadForm.hidden = true;
    document.getElementById("lead-success").hidden = false;

    if (tg && tg.HapticFeedback) {
      tg.HapticFeedback.notificationOccurred("success");
    }
  } catch (e) {
    errorEl.textContent = "Ошибка сети. Попробуйте ещё раз.";
  }
});

// ---------- Инициализация ----------
showScreen("home");
