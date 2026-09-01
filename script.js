const STORAGE_KEY = "avenir-comptes-v6";
const LEGACY_STORAGE_KEY = "avenir-comptes-v5";
const UPDATED_KEY = "avenir-derniere-mise-a-jour-v6";
const LEGACY_UPDATED_KEY = "avenir-derniere-mise-a-jour-v5";
const BASE_TOTAL = 93400;

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

const accountsList = document.getElementById("accountsList");
const totalAmount = document.getElementById("totalAmount");
const privacyToggleButton = document.getElementById("privacyToggleButton");
const PRIVACY_MODE_KEY = "avenir-mode-confidentiel-v1";
const PREVIOUS_TOTAL_KEY = "avenir-patrimoine-precedent-v1";

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
const exportAccountsButton = document.getElementById("exportAccountsButton");
const importAccountsButton = document.getElementById("importAccountsButton");
const importAccountsInput = document.getElementById("importAccountsInput");
const accountCardTemplate = document.getElementById("accountCardTemplate");
const settingsAccountTemplate = document.getElementById("settingsAccountTemplate");

let settingsSnapshot = null;

const msciNoteOverlay = document.getElementById("msciNoteOverlay");
const msciNoteText = document.getElementById("msciNoteText");
const closeMsciNoteButton = document.getElementById("closeMsciNoteButton");

const MSCI_NOTE_KEY = "avenir-msci-note";
const MSCI_DETAILS_KEY = "avenir-msci-details-v1";
const DEFAULT_MSCI_DETAILS = {
  openingDate: "02/02/26",
  insurer: "Linxea - Suravenir",
  support: "Amundi MSCI World Swap II UCITS ETF Dist FR0010315770",
  about: "Support diversifié investi sur les marchés mondiaux avec une vision de long terme.",
  arbitrages: "À renseigner"
};

function loadMsciDetails() {
  try {
    const saved = JSON.parse(localStorage.getItem(MSCI_DETAILS_KEY) || "null");
    return { ...DEFAULT_MSCI_DETAILS, ...(saved && typeof saved === "object" ? saved : {}) };
  } catch (error) {
    console.error("Erreur de chargement des informations MSCI :", error);
    return { ...DEFAULT_MSCI_DETAILS };
  }
}

function saveMsciDetails(details) {
  localStorage.setItem(MSCI_DETAILS_KEY, JSON.stringify(details));
}

let msciDetails = loadMsciDetails();

const REVOLUT_DETAILS_KEY = "avenir-revolut-details-v1";
const DEFAULT_REVOLUT_DETAILS = {
  accountType: "Compte courant",
  about: "Réserve disponible pour financer les dépenses importantes, puis reconstituée progressivement."
};

function loadRevolutDetails() {
  try {
    const saved = JSON.parse(localStorage.getItem(REVOLUT_DETAILS_KEY) || "null");
    return { ...DEFAULT_REVOLUT_DETAILS, ...(saved && typeof saved === "object" ? saved : {}) };
  } catch (error) {
    console.error("Erreur de chargement des informations Revolut :", error);
    return { ...DEFAULT_REVOLUT_DETAILS };
  }
}

function saveRevolutDetails(details) {
  localStorage.setItem(REVOLUT_DETAILS_KEY, JSON.stringify(details));
}

let revolutDetails = loadRevolutDetails();

const LIVRET_A_DETAILS_KEY = "avenir-livret-a-details-v1";
const DEFAULT_LIVRET_A_DETAILS = {
  interestRate: "1,7%",
  interests: "549,19€",
  ceiling: "22 950 €",
  about: "Épargne sécurisée, disponible à tout moment et exonérée d’impôt."
};

function loadLivretADetails() {
  try {
    const saved = JSON.parse(localStorage.getItem(LIVRET_A_DETAILS_KEY) || "null");
    return { ...DEFAULT_LIVRET_A_DETAILS, ...(saved && typeof saved === "object" ? saved : {}) };
  } catch (error) {
    console.error("Erreur de chargement des informations Livret A :", error);
    return { ...DEFAULT_LIVRET_A_DETAILS };
  }
}

function saveLivretADetails(details) {
  localStorage.setItem(LIVRET_A_DETAILS_KEY, JSON.stringify(details));
}

let livretADetails = loadLivretADetails();

const LDD_DETAILS_KEY = "avenir-ldd-details-v1";
const DEFAULT_LDD_DETAILS = {
  interestRate: "1,7%",
  interests: "269,64€",
  ceiling: "12 000 €",
  about: "Épargne sécurisée et disponible immédiatement, complémentaire au Livret A."
};

function loadLddDetails() {
  try {
    const saved = JSON.parse(localStorage.getItem(LDD_DETAILS_KEY) || "null");
    return { ...DEFAULT_LDD_DETAILS, ...(saved && typeof saved === "object" ? saved : {}) };
  } catch (error) {
    console.error("Erreur de chargement des informations LDD :", error);
    return { ...DEFAULT_LDD_DETAILS };
  }
}

function saveLddDetails(details) {
  localStorage.setItem(LDD_DETAILS_KEY, JSON.stringify(details));
}

let lddDetails = loadLddDetails();

const FONDS_EURO_DETAILS_KEY = "avenir-fonds-euro-details-v1";
const DEFAULT_FONDS_EURO_DETAILS = {
  openingDate: "02/02/26",
  insurer: "Linxea - Suravenir",
  support: "Fonds euros Suravenir Opportunité 2",
  about: "Support sécurisé de l’assurance vie, destiné à préserver le capital tout en générant des intérêts. Mensualités 200/mois."
};

function loadFondsEuroDetails() {
  try {
    const saved = JSON.parse(localStorage.getItem(FONDS_EURO_DETAILS_KEY) || "null");
    return { ...DEFAULT_FONDS_EURO_DETAILS, ...(saved && typeof saved === "object" ? saved : {}) };
  } catch (error) {
    console.error("Erreur de chargement des informations Fonds euro :", error);
    return { ...DEFAULT_FONDS_EURO_DETAILS };
  }
}

function saveFondsEuroDetails(details) {
  localStorage.setItem(FONDS_EURO_DETAILS_KEY, JSON.stringify(details));
}

let fondsEuroDetails = loadFondsEuroDetails();

const PER_DETAILS_KEY = "avenir-per-details-v1";
const DEFAULT_PER_DETAILS = {
  openingDate: "02/02/26",
  insurer: "Linxea - Suravenir",
  accountType: "PER individuel (Périn)",
  about: "Épargne à long terme dédiée à la préparation de la retraite, bénéficiant d'un cadre fiscal avantageux"
};

function loadPerDetails() {
  try {
    const saved = JSON.parse(localStorage.getItem(PER_DETAILS_KEY) || "null");
    return { ...DEFAULT_PER_DETAILS, ...(saved && typeof saved === "object" ? saved : {}) };
  } catch (error) {
    console.error("Erreur de chargement des informations PER :", error);
    return { ...DEFAULT_PER_DETAILS };
  }
}

function savePerDetails(details) {
  localStorage.setItem(PER_DETAILS_KEY, JSON.stringify(details));
}

let perDetails = loadPerDetails();

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
  const iconEl = document.getElementById("evolutionIcon");
  const percentEl = document.getElementById("evolutionPercentage");

  if (!iconEl || !percentEl) return;

  if (!BASE_TOTAL || BASE_TOTAL === 0) {
    iconEl.textContent = "";
    percentEl.textContent = "";
    return;
  }

  const diff = currentTotal - BASE_TOTAL;
  const percentage = (diff / BASE_TOTAL) * 100;
  const formattedPercent = Math.abs(percentage).toFixed(2).replace(".", ",") + " %";

  if (diff > 0) {
    iconEl.textContent = "▲ ";
    percentEl.textContent = `+${formattedPercent}`;
    percentEl.style.color = "#10B981";
  } else if (diff < 0) {
    iconEl.textContent = "▼ ";
    percentEl.textContent = `-${formattedPercent}`;
    percentEl.style.color = "#EF4444";
  } else {
    iconEl.textContent = "► ";
    percentEl.textContent = "0,00 %";
    percentEl.style.color = "#9CA3AF";
  }
}

/* ===== AV€NIR V10.8 : animation des montants ===== */
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
    if (typeof onUpdate === "function") onUpdate(to);
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

      if (typeof onUpdate === "function") {
        onUpdate(current);
      }

      if (progress < 1) {
        state.frameId = requestAnimationFrame(frame);
      } else {
        element.textContent = `${formatAmount(to)}${suffix}`;
        if (typeof onUpdate === "function") onUpdate(to);
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

function handleAccountClick(account) {
  const icon = inferIcon(account);
  if (icon === "msci") {
    openMsciModal(account);
  } else if (icon === "revolut") {
    openRevolutModal(account);
  } else if (icon === "livret-a") {
    openLivretAModal(account);
  } else if (icon === "ldd") {
    openLddModal(account);
  } else if (icon === "assurance-vie") {
    openFondsEuroModal(account);
  } else if (icon === "per") {
    openPerModal(account);
  }
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
    const card = fragment.querySelector(".account-card");
    const icon = fragment.querySelector(".account-icon");
    const amountElement = fragment.querySelector(".account-amount");

    icon.src = ICONS[account.icon] || ICONS.revolut;
    icon.alt = account.name;
    fragment.querySelector(".account-name").textContent = account.name;
    amountElement.textContent = "0,00";

    card.addEventListener("click", () => handleAccountClick(account));

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

  if (firstRenderDuringBoot) {
    totalAmount.textContent = "0,00 €";
  } else {
    animateAmount(
      totalAmount,
      firstRender ? 0 : previousTotal,
      calculateTotal(),
      {
        duration: firstRender ? 1100 : 720,
        suffix: " €",
        onUpdate: (val) => updateEvolution(val)
      }
    );
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatEditableAmount(value) {
  const number = Number(value) || 0;
  return Number.isInteger(number)
    ? String(number)
    : number.toLocaleString("fr-FR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        useGrouping: false
      });
}

function showSettingsToast(message) {
  let toast = document.getElementById("saveToast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "saveToast";
    toast.className = "save-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.remove("is-visible");
  void toast.offsetWidth;
  toast.classList.add("is-visible");

  clearTimeout(showSettingsToast.timer);
  showSettingsToast.timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1600);
}

function showSaveToast() {
  showSettingsToast("✓ Modifications enregistrées");
}

function showCancelToast() {
  showSettingsToast("↩ Modifications annulées");
}

function confirmAccountDeletion(accountName) {
  return new Promise(resolve => {
    const existing = document.getElementById("deleteAccountDialog");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "deleteAccountDialog";
    overlay.className = "delete-dialog-overlay";
    overlay.innerHTML = `
      <section class="delete-dialog" role="dialog" aria-modal="true" aria-labelledby="deleteDialogTitle">
        <div class="delete-dialog-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 7h16"></path>
            <path d="M10 11v6"></path>
            <path d="M14 11v6"></path>
            <path d="M6 7l1 14h10l1-14"></path>
            <path d="M9 7V4h6v3"></path>
          </svg>
        </div>
        <h2 id="deleteDialogTitle">Supprimer ce compte ?</h2>
        <p>« ${escapeHtml(accountName)} » sera retiré de l’application.</p>
        <div class="delete-dialog-actions">
          <button type="button" class="delete-dialog-cancel">Annuler</button>
          <button type="button" class="delete-dialog-confirm">Supprimer</button>
        </div>
      </section>`;

    document.body.appendChild(overlay);
    const cancelButton = overlay.querySelector(".delete-dialog-cancel");
    const confirmButton = overlay.querySelector(".delete-dialog-confirm");
    let closed = false;

    const close = result => {
      if (closed) return;
      closed = true;
      overlay.classList.remove("is-visible");
      window.setTimeout(() => overlay.remove(), 180);
      document.removeEventListener("keydown", onKeyDown);
      resolve(result);
    };

    const onKeyDown = event => {
      if (event.key === "Escape") close(false);
    };

    cancelButton.addEventListener("click", () => close(false));
    confirmButton.addEventListener("click", () => close(true));
    overlay.addEventListener("click", event => {
      if (event.target === overlay) close(false);
    });
    document.addEventListener("keydown", onKeyDown);

    requestAnimationFrame(() => {
      overlay.classList.add("is-visible");
      cancelButton.focus();
    });
  });
}

function renderSettings() {
  if (!settingsAccounts) return;
  se

/* ===== GESTION DU CODE PIN & DÉMARRAGE ===== */

const PIN_ENABLED_KEY = "avenir-pin-enabled-v1";
const PIN_HASH_KEY = "avenir-pin-hash-v1";

const pinLockScreen = document.getElementById("pinLockScreen");
const pinDots = document.getElementById("pinDots");
const pinLockMessage = document.getElementById("pinLockMessage");
const pinKeypadMount = document.querySelector(".pin-keypad-mount");

let enteredPin = "";

function isPinEnabled() {
  return localStorage.getItem(PIN_ENABLED_KEY) === "true" && Boolean(localStorage.getItem(PIN_HASH_KEY));
}

// Fonction de hachage simple du PIN (à adapter selon ta méthode)
function hashPin(pin) {
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return String(hash);
}

function updatePinDots() {
  if (!pinDots) return;
  const dots = pinDots.querySelectorAll("span");
  dots.forEach((dot, index) => {
    dot.classList.toggle("filled", index < enteredPin.length);
  });
  pinDots.setAttribute("aria-label", `Code saisi : ${enteredPin.length} chiffre(s) sur 6`);
}

function verifyPin() {
  const savedHash = localStorage.getItem(PIN_HASH_KEY);
  if (hashPin(enteredPin) === savedHash) {
    unlockApp();
  } else {
    if (pinLockMessage) pinLockMessage.textContent = "Code incorrect. Réessayez.";
    if (pinLockScreen) pinLockScreen.classList.add("shake");
    setTimeout(() => {
      if (pinLockScreen) pinLockScreen.classList.remove("shake");
      enteredPin = "";
      updatePinDots();
    }, 400);
  }
}

function handleKeyPress(digit) {
  if (enteredPin.length < 6) {
    enteredPin += digit;
    updatePinDots();
    if (enteredPin.length === 6) {
      setTimeout(verifyPin, 100);
    }
  }
}

function handleBackspace() {
  if (enteredPin.length > 0) {
    enteredPin = enteredPin.slice(0, -1);
    updatePinDots();
  }
}

function renderKeypad() {
  if (!pinKeypadMount) return;
  pinKeypadMount.innerHTML = "";

  const keypadGrid = document.createElement("div");
  keypadGrid.className = "pin-keypad";

  const buttons = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

  buttons.forEach(val => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pin-key";
    
    if (val === "") {
      btn.classList.add("empty");
      btn.disabled = true;
    } else if (val === "⌫") {
      btn.classList.add("backspace");
      btn.textContent = "⌫";
      btn.addEventListener("click", handleBackspace);
    } else {
      btn.textContent = val;
      btn.addEventListener("click", () => handleKeyPress(val));
    }

    keypadGrid.appendChild(btn);
  });

  pinKeypadMount.appendChild(keypadGrid);
}

function unlockApp() {
  if (pinLockScreen) pinLockScreen.hidden = true;
  document.documentElement.classList.remove("pin-boot");
  document.documentElement.classList.remove("app-boot");
}

function initSecurity() {
  if (isPinEnabled()) {
    if (pinLockScreen) pinLockScreen.hidden = false;
    renderKeypad();
    // Le retrait de app-boot se fait uniquement à la saisie du bon PIN
  } else {
    // Si pas de PIN configuré, on déverrouille direct
    unlockApp();
  }
}

// Lancement au chargement du script
initSecurity();
  
