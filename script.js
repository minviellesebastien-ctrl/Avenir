const STORAGE_KEY = "avenir-comptes-v6";
const LEGACY_STORAGE_KEY = "avenir-comptes-v5";
const UPDATED_KEY = "avenir-derniere-mise-a-jour-v6";
const LEGACY_UPDATED_KEY = "avenir-derniere-mise-a-jour-v5";

const ICONS = {
  "revolut": "./revolut.png",
  "livret-a": "./livret-a.png",
  "ldd": "./ldd.png",
  "lep": "./lep.png",
  "assurance-vie": "./assurance-vie.png",
  "msci": "./msci.png",
  "per": "./per.png"
};

const DEFAULT_ACCOUNTS = [
  { icon: "revolut", name: "REVOLUT", amount: 8446.36 },
  { icon: "livret-a", name: "LCL - Livret A", amount: 26003.44 },
  { icon: "ldd", name: "LCL - LDD", amount: 12747.87 },
  { icon: "lep", name: "LCL - LEP", amount: 10856.51 },
  { icon: "assurance-vie", name: "LINXEA - Avenir 2", amount: 20334.56 },
  { icon: "msci", name: "LINXEA - MSCI", amount: 5589.54 },
  { icon: "per", name: "LINXEA - PER", amount: 10017.55 }
];

const BASE_TOTAL = 93400;

const accountsList = document.getElementById("accountsList");
const totalAmount = document.getElementById("totalAmount");
const privacyToggleButton = document.getElementById("privacyToggleButton");
const PRIVACY_MODE_KEY = "avenir-mode-confidentiel-v1";
const patrimoineEvolution = document.getElementById("patrimoineEvolution");

function isPrivacyModeEnabled() {
  return localStorage.getItem(PRIVACY_MODE_KEY) === "true";
}

function applyPrivacyMode(enabled, animate = true) {
  if (animate) {
    document.body.classList.add("privacy-transition");
    window.clearTimeout(applyPrivacyMode.transitionTimer);
    applyPrivacyMode.transitionTimer = window.setTimeout(() => {
      document.body.classList.remove("privacy-transition");
    }, 220);
  }

  document.body.classList.toggle("privacy-mode", enabled);
  privacyToggleButton?.classList.toggle("is-private", enabled);
  privacyToggleButton?.setAttribute("aria-pressed", String(enabled));

  const label = enabled ? "Afficher les montants" : "Masquer les montants";
  privacyToggleButton?.setAttribute("aria-label", label);
  privacyToggleButton?.setAttribute("title", label);

  localStorage.setItem(PRIVACY_MODE_KEY, String(enabled));
}

function togglePrivacyMode() {
  applyPrivacyMode(!document.body.classList.contains("privacy-mode"));
}

privacyToggleButton?.addEventListener("click", togglePrivacyMode);
applyPrivacyMode(isPrivacyModeEnabled(), false);

if (document.documentElement.classList.contains("privacy-boot")) {
  window.requestAnimationFrame(() => {
    document.documentElement.classList.add("privacy-boot-finish");

    window.setTimeout(() => {
      document.documentElement.classList.remove("privacy-boot", "privacy-boot-finish");
    }, 210);
  });
}

const lastUpdated = document.getElementById("lastUpdated");
const openSettingsButton = document.getElementById("openSettingsButton");
const closeSettingsButton = document.getElementById("closeSettingsButton");
const settingsOverlay = document.getElementById("settingsOverlay");
const settingsAccounts = document.getElementById("settingsAccounts");
const addAccountButton = document.getElementById("addAccountButton");
const saveSettingsButton = document.getElementById("saveSettingsButton");
const accountCardTemplate = document.getElementById("accountCardTemplate");
const settingsAccountTemplate = document.getElementById("settingsAccountTemplate");

let accounts = loadAccounts();

function cloneDefaults() {
  return DEFAULT_ACCOUNTS.map(account => ({ ...account }));
}

function parseAmount(value) {
  const cleaned = String(value)
    .replace(/\u00a0/g, "")
    .replace(/\s/g, "")
    .replace(/€/g, "")
    .replace(",", ".")
    .replace(/[^0-9.-]/g, "");

  const number = Number.parseFloat(cleaned);
  return Number.isFinite(number) ? number : 0;
}

function formatAmount(value) {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function updateEvolution(currentTotal) {
  if (!patrimoineEvolution) return;
  const percentage = ((currentTotal - BASE_TOTAL) / BASE_TOTAL) * 100;
  const sign = percentage >= 0 ? "+" : "";
  patrimoineEvolution.textContent = `↗ ${sign}${percentage.toFixed(2)}%`;
}

const amountAnimations = new WeakMap();
const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

function readDisplayedAmount(element) {
  if (!element) return 0;
  return parseAmount(element.textContent || "0");
}

function animateAmount(element, fromValue, toValue, options = {}) {
  if (!element) return;

  const {
    duration = 850,
    suffix = "",
    delay = 0,
    onUpdate
  } = options;

  const previousAnimation = amountAnimations.get(element);
  if (previousAnimation) {
    cancelAnimationFrame(previousAnimation.frameId);
    window.clearTimeout(previousAnimation.delayId);
  }

  const from = Number.isFinite(fromValue) ? fromValue : 0;
  const to = Number.isFinite(toValue) ? toValue : 0;

  if (prefersReducedMotion || duration <= 0 || Math.abs(to - from) < 0.005) {
    element.textContent = `${formatAmount(to)}${suffix}`;
    if (onUpdate) onUpdate(to);
    amountAnimations.delete(element);
    return;
  }

  element.textContent = `${formatAmount(from)}${suffix}`;

  const state = { frameId: 0, delayId: 0 };
  amountAnimations.set(element, state);

  state.delayId = window.setTimeout(() => {
    let startedAt = null;

    function easeOutQuart(value) {
      return 1 - Math.pow(1 - value, 4);
    }

    function frame(timestamp) {
      if (startedAt === null) startedAt = timestamp;

      const progress = Math.min((timestamp - startedAt) / duration, 1);
      const current = from + (to - from) * easeOutQuart(progress);
      element.textContent = `${formatAmount(current)}${suffix}`;
      if (onUpdate) onUpdate(current);

      if (progress < 1) {
        state.frameId = requestAnimationFrame(frame);
      } else {
        element.textContent = `${formatAmount(to)}${suffix}`;
        if (onUpdate) onUpdate(to);
        amountAnimations.delete(element);
      }
    }

    state.frameId = requestAnimationFrame(frame);
  }, delay);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(value);
}

function inferIcon(account) {
  if (account.icon && ICONS[account.icon]) return account.icon;

  const name = String(account.name || "").toLowerCase();
  if (name.includes("revolut")) return "revolut";
  if (name.includes("livret a") || name === "livrets") return "livret-a";
  if (name.includes("ldd") || name.includes("ldds")) return "ldd";
  if (name.includes("lep")) return "lep";
  if (name.includes("msci") || name.includes("world")) return "msci";
  if (name.includes("per")) return "per";
  if (name.includes("assurance") || name.includes("fonds euro")) return "assurance-vie";
  return "revolut";
}

function normalizeAccount(account) {
  return {
    icon: inferIcon(account),
    name: account.name || "Compte",
    amount: parseAmount(account.amount)
  };
}

function loadAccounts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
  const source = saved || legacy;

  if (!source) return cloneDefaults();

  try {
    const parsed = JSON.parse(source);
    if (!Array.isArray(parsed)) throw new Error("Format incorrect");

    const normalized = parsed.map(normalizeAccount);

    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }

    return normalized;
  } catch (error) {
    console.error("Erreur de chargement :", error);
    return cloneDefaults();
  }
}

function saveAccounts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));

  const now = new Date();
  localStorage.setItem(UPDATED_KEY, now.toISOString());
  if (lastUpdated) lastUpdated.textContent = formatDate(now);
}

function renderLastUpdated() {
  if (!lastUpdated) return;
  const saved = localStorage.getItem(UPDATED_KEY) || localStorage.getItem(LEGACY_UPDATED_KEY);

  if (!saved) {
    lastUpdated.textContent = formatDate(new Date());
    return;
  }

  const parsed = new Date(saved);
  lastUpdated.textContent = Number.isNaN(parsed.getTime())
    ? formatDate(new Date())
    : formatDate(parsed);
}

function calculateTotal() {
  return accounts.reduce(
    (total, account) => total + parseAmount(account.amount),
    0
  );
}

function renderAccounts() {
  const previousCardAmounts = [...accountsList.querySelectorAll(".account-amount")]
    .map(readDisplayedAmount);
  const previousTotal = readDisplayedAmount(totalAmount);
  const firstRender = accountsList.children.length === 0;
  const firstRenderDuringBoot = firstRender && document.documentElement.classList.contains("app-boot");

  accountsList.innerHTML = "";

  accounts.forEach((account, index) => {
    const fragment = accountCardTemplate.content.cloneNode(true);
    const icon = fragment.querySelector(".account-icon");
    const amountElement = fragment.querySelector(".account-amount");

    icon.src = ICONS[account.icon] || ICONS.revolut;
    icon.alt = account.name;
    fragment.querySelector(".account-name").textContent = account.name;
    amountElement.textContent = "0,00";

    accountsList.appendChild(fragment);

    if (firstRenderDuringBoot) {
      amountElement.textContent = "0,00";
    } else {
      animateAmount(
        amountElement,
        firstRender ? 0 : (previousCardAmounts[index] ?? 0),
        parseAmount(account.amount),
        {
          duration: firstRender ? 950 : 620,
          delay: firstRender ? index * 55 : 0
        }
      );
    }
  });

  const total = calculateTotal();

  if (firstRenderDuringBoot) {
    totalAmount.textContent = "0,00 €";
    updateEvolution(0);
  } else {
    animateAmount(
      totalAmount,
      firstRender ? 0 : previousTotal,
      total,
      {
        duration: firstRender ? 1100 : 720,
        suffix: " €",
        onUpdate: (val) => updateEvolution(val)
      }
    );
  }
}

function openSettings() {
  renderSettings();
  settingsOverlay.hidden = false;
  document.body.classList.add("settings-open");
}

function closeSettings() {
  settingsOverlay.hidden = true;
  document.body.classList.remove("settings-open");
}

function renderSettings() {
  settingsAccounts.innerHTML = "";
  accounts.forEach((account, index) => {
    const fragment = settingsAccountTemplate.content.cloneNode(true);
    const nameInput = fragment.querySelector(".name-input");
    const amountInput = fragment.querySelector(".amount-input");
    const deleteBtn = fragment.querySelector(".delete-account-button");

    nameInput.value = account.name;
    amountInput.value = account.amount;

    nameInput.addEventListener("input", (e) => {
      accounts[index].name = e.target.value;
    });

    amountInput.addEventListener("input", (e) => {
      accounts[index].amount = parseAmount(e.target.value);
    });

    deleteBtn.addEventListener("click", () => {
      accounts.splice(index, 1);
      renderSettings();
    });

    settingsAccounts.appendChild(fragment);
  });
}

openSettingsButton?.addEventListener("click", openSettings);
closeSettingsButton?.addEventListener("click", closeSettings);
addAccountButton?.addEventListener("click", () => {
  accounts.push({ icon: "revolut", name: "Nouveau compte", amount: 0 });
  renderSettings();
});

saveSettingsButton?.addEventListener("click", () => {
  saveAccounts();
  renderAccounts();
  closeSettings();
});

document.addEventListener("DOMContentLoaded", () => {
  renderLastUpdated();
  renderAccounts();
});
                                 
