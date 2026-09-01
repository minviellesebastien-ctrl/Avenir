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

const accountsList = document.getElementById("accountsList");
const totalAmount = document.getElementById("totalAmount");
const privacyToggleButton = document.getElementById("privacyToggleButton");
const PRIVACY_MODE_KEY = "avenir-mode-confidentiel-v1";
const PREVIOUS_TOTAL_KEY = "avenir-patrimoine-precedent-v1";
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
const exportAccountsButton = document.getElementById("exportAccountsButton");
const importAccountsButton = document.getElementById("importAccountsButton");
const importAccountsInput = document.getElementById("importAccountsInput");
const accountCardTemplate = document.getElementById("accountCardTemplate");
const settingsAccountTemplate = document.getElementById("settingsAccountTemplate");
let settingsSnapshot = null;
const msciNoteOverlay =
  document.getElementById("msciNoteOverlay");

const msciNoteText =
  document.getElementById("msciNoteText");

const closeMsciNoteButton =
  document.getElementById("closeMsciNoteButton");

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
    return {
      ...DEFAULT_REVOLUT_DETAILS,
      ...(saved && typeof saved === "object" ? saved : {})
    };
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
    return {
      ...DEFAULT_LIVRET_A_DETAILS,
      ...(saved && typeof saved === "object" ? saved : {})
    };
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
    return {
      ...DEFAULT_LDD_DETAILS,
      ...(saved && typeof saved === "object" ? saved : {})
    };
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
    return {
      ...DEFAULT_FONDS_EURO_DETAILS,
      ...(saved && typeof saved === "object" ? saved : {})
    };
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
    return {
      ...DEFAULT_PER_DETAILS,
      ...(saved && typeof saved === "object" ? saved : {})
    };
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

/* ===== AV€NIR V10.8 : animation fiable des montants ===== */
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
    delay = 0
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

      if (progress < 1) {
        state.frameId = requestAnimationFrame(frame);
      } else {
        element.textContent = `${formatAmount(to)}${suffix}`;
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
  lastUpdated.textContent = formatDate(now);
}

function renderLastUpdated() {
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
      // Les montants restent à zéro tant que l'accueil n'est pas prêt.
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
        suffix: " €"
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
  settingsAccounts.innerHTML = "";

  accounts.forEach((account, index) => {
    const fragment = settingsAccountTemplate.content.cloneNode(true);
    const row = fragment.querySelector(".settings-account-row");
    const iconImage = fragment.querySelector(".settings-account-icon");
    const nameInput = fragment.querySelector(".name-input");
    const amountInput = fragment.querySelector(".amount-input");
    const deleteButton = fragment.querySelector(".delete-account-button");
    const isCustom = account.custom === true;
    const accountIcon = inferIcon(account);

    iconImage.src = ICONS[accountIcon] || ICONS.revolut;
    iconImage.alt = "";
    nameInput.value = account.name;
    amountInput.value = `${formatAmount(account.amount)} €`;
    row.dataset.index = index;
    row.dataset.custom = isCustom ? "true" : "false";
    row.dataset.icon = accountIcon;
    row.classList.toggle("is-custom-account", isCustom);
    row.classList.toggle("is-system-account", !isCustom);

    deleteButton.hidden = false;

    amountInput.addEventListener("focus", () => {
      amountInput.value = formatEditableAmount(parseAmount(amountInput.value));
      requestAnimationFrame(() => amountInput.select());
    });

    amountInput.addEventListener("blur", () => {
      amountInput.value = `${formatAmount(parseAmount(amountInput.value))} €`;
    });

    if (!isCustom && accountIcon === "msci") {
      const field = document.createElement("label");
      field.className = "settings-field settings-arbitrages-field";
      field.innerHTML = `
        <span>Arbitrages</span>
        <textarea class="msci-arbitrages-input" rows="3" autocomplete="off">${escapeHtml(msciDetails.arbitrages)}</textarea>`;
      row.appendChild(field);
    }

    deleteButton.addEventListener("click", async () => {
      // Animation volontairement marquée avant l’ouverture de la confirmation.
      deleteButton.classList.remove("is-trash-animating");
      void deleteButton.offsetWidth;
      deleteButton.classList.add("is-trash-animating");
      await new Promise(resolve => window.setTimeout(resolve, 340));
      deleteButton.classList.remove("is-trash-animating");
      const confirmed = await confirmAccountDeletion(account.name);
      if (!confirmed) return;

      readSettingsValues();
      const currentRows = [...settingsAccounts.querySelectorAll(".settings-account-row")];
      const currentIndex = currentRows.indexOf(row);
      if (currentIndex < 0) return;
      accounts.splice(currentIndex, 1);
      saveAccounts();
      renderAccounts();
      renderSettings();
    });

    settingsAccounts.appendChild(fragment);
  });

  renderPinSettingsPanel();
}

function readSettingsValues() {
  const rows = [...settingsAccounts.querySelectorAll(".settings-account-row")];

  accounts = rows.map(row => {
    const isCustom = row.dataset.custom === "true";
    const previousIndex = Number.parseInt(row.dataset.index, 10);
    const previousAccount = Number.isInteger(previousIndex) ? accounts[previousIndex] : null;
    return {
      icon: previousAccount?.icon || row.dataset.icon || "revolut",
      name: row.querySelector(".name-input")?.value.trim() || "Compte",
      amount: parseAmount(row.querySelector(".amount-input")?.value),
      custom: isCustom
    };
  });

  const msciRow = rows.find(row => row.dataset.custom !== "true" && row.dataset.icon === "msci");

  const arbitragesInput = msciRow?.querySelector(".msci-arbitrages-input");
  if (arbitragesInput) {
    msciDetails = {
      ...msciDetails,
      arbitrages: arbitragesInput.value.trim() || "À renseigner"
    };
    saveMsciDetails(msciDetails);
  }
}

function saveFromSettings() {
  readSettingsValues();
  saveAccounts();
  renderAccounts();
}

function openSettings() {
  openSettingsButton.classList.add("is-turning");

  window.setTimeout(() => {
    settingsSnapshot = {
      accounts: JSON.parse(JSON.stringify(accounts)),
      msciDetails: JSON.parse(JSON.stringify(msciDetails)),
      updatedAt: localStorage.getItem(UPDATED_KEY)
    };

    renderSettings();
    settingsOverlay.hidden = false;
    document.body.classList.add("settings-open");

    window.setTimeout(() => {
      openSettingsButton.classList.remove("is-turning");
    }, 250);
  }, 180);
}

function hideOverlayWithAnimation(overlay, panelSelector, bodyClass, duration = 220) {
  if (!overlay || overlay.hidden || overlay.classList.contains("is-closing")) return Promise.resolve();

  const panel = overlay.querySelector(panelSelector);
  overlay.classList.add("is-closing");
  panel?.classList.add("is-closing");

  return new Promise(resolve => {
    window.setTimeout(() => {
      overlay.hidden = true;
      overlay.classList.remove("is-closing");
      panel?.classList.remove("is-closing");
      document.body.classList.remove(bodyClass);
      resolve();
    }, prefersReducedMotion ? 0 : duration);
  });
}

async function closeSettings() {
  if (!settingsSnapshot) {
    await hideOverlayWithAnimation(settingsOverlay, ".settings-panel", "settings-open");
    return;
  }

  // Les champs sont prévisualisés en direct dans l'accueil, mais la croix
  // restaure toujours l'état exact présent à l'ouverture des paramètres.
  const currentState = JSON.stringify({
    accounts,
    msciDetails
  });
  const originalState = JSON.stringify({
    accounts: settingsSnapshot.accounts,
    msciDetails: settingsSnapshot.msciDetails
  });
  const hadChanges = currentState !== originalState;

  accounts = JSON.parse(JSON.stringify(settingsSnapshot.accounts));
  msciDetails = JSON.parse(JSON.stringify(settingsSnapshot.msciDetails));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  saveMsciDetails(msciDetails);

  if (settingsSnapshot.updatedAt === null) {
    localStorage.removeItem(UPDATED_KEY);
  } else {
    localStorage.setItem(UPDATED_KEY, settingsSnapshot.updatedAt);
  }

  renderAccounts();
  renderLastUpdated();

  settingsSnapshot = null;
  await hideOverlayWithAnimation(settingsOverlay, ".settings-panel", "settings-open");

  if (hadChanges) {
    showCancelToast();
  }
}

function collectAvenirBackup() {
  const data = {};

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key && key.startsWith("avenir-")) {
      data[key] = localStorage.getItem(key);
    }
  }

  return {
    app: "AV€NIR",
    version: "13.9",
    exportedAt: new Date().toISOString(),
    data
  };
}

function exportAvenirData() {
  readSettingsValues();
  saveAccounts();

  const backup = collectAvenirBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = `avenir-sauvegarde-${date}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  const label = exportAccountsButton?.querySelector("span:last-child");
  if (label) {
    const previous = label.textContent;
    label.textContent = "Exporté";
    window.setTimeout(() => { label.textContent = previous; }, 1200);
  }
}

function openAvenirImportPicker() {
  importAccountsInput?.click();
}

async function importAvenirData(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const parsed = JSON.parse(await file.text());
    const data = parsed?.data;

    if (parsed?.app !== "AV€NIR" || !data || typeof data !== "object" || Array.isArray(data)) {
      throw new Error("Sauvegarde AV€NIR invalide");
    }

    const entries = Object.entries(data).filter(([key, value]) =>
      key.startsWith("avenir-") && typeof value === "string"
    );

    if (!entries.length) {
      throw new Error("La sauvegarde ne contient aucune donnée AV€NIR");
    }

    const confirmed = window.confirm(
      "Importer cette sauvegarde remplacera les données AV€NIR actuelles. Continuer ?"
    );
    if (!confirmed) return;

    [...Array(localStorage.length).keys()]
      .map(index => localStorage.key(index))
      .filter(key => key?.startsWith("avenir-"))
      .forEach(key => localStorage.removeItem(key));

    entries.forEach(([key, value]) => localStorage.setItem(key, value));
    window.location.reload();
  } catch (error) {
    console.error("Erreur d’import AV€NIR :", error);
    window.alert("Impossible d’importer ce fichier : sauvegarde AV€NIR non valide.");
  } finally {
    event.target.value = "";
  }
}

function addAccount() {
  readSettingsValues();

  accounts.push({
    icon: "revolut",
    name: "Nouveau compte",
    amount: 0,
    custom: true
  });

  saveAccounts();
  renderAccounts();
  renderSettings();

  const rows = settingsAccounts.querySelectorAll(".settings-account-row");
  const newRow = rows[rows.length - 1];

  if (newRow) {
    window.setTimeout(() => {
      newRow.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  }
}

let draggedSettingsRow = null;
let draggedPointerId = null;

settingsAccounts.addEventListener("pointerdown", event => {
  const handle = event.target.closest(".drag-handle");

  if (!handle) return;

  const row = handle.closest(".settings-account-row");

  if (!row) return;

  event.preventDefault();

  draggedSettingsRow = row;
  draggedPointerId = event.pointerId;

  row.classList.add("is-dragging");
  document.body.classList.add("account-drag-active");

  if ("vibrate" in navigator) {
    navigator.vibrate(40);
  }
});

document.addEventListener(
  "pointermove",
  event => {
    if (
      !draggedSettingsRow ||
      event.pointerId !== draggedPointerId
    ) {
      return;
    }

    event.preventDefault();

    const elementUnderFinger =
      document.elementFromPoint(
        event.clientX,
        event.clientY
      );

    const targetRow =
      elementUnderFinger?.closest(
        ".settings-account-row"
      );

    if (
      !targetRow ||
      targetRow === draggedSettingsRow ||
      !settingsAccounts.contains(targetRow)
    ) {
      return;
    }

    const targetBox =
      targetRow.getBoundingClientRect();

    const placeBefore =
      event.clientY <
      targetBox.top + targetBox.height / 2;

    if (placeBefore) {
      settingsAccounts.insertBefore(
        draggedSettingsRow,
        targetRow
      );
    } else {
      settingsAccounts.insertBefore(
        draggedSettingsRow,
        targetRow.nextSibling
      );
    }
  },
  { passive: false }
);

function finishAccountDrag(event) {
  if (
    !draggedSettingsRow ||
    event.pointerId !== draggedPointerId
  ) {
    return;
  }

  draggedSettingsRow.classList.remove(
    "is-dragging"
  );

  document.body.classList.remove(
    "account-drag-active"
  );

  draggedSettingsRow = null;
  draggedPointerId = null;

  readSettingsValues();
  saveAccounts();
  renderAccounts();
  renderSettings();
}

document.addEventListener(
  "pointerup",
  finishAccountDrag
);

document.addEventListener(
  "pointercancel",
  finishAccountDrag
);

openSettingsButton.addEventListener("click", openSettings);
closeSettingsButton.addEventListener("click", closeSettings);
saveSettingsButton.addEventListener("click", async () => {
  if (saveSettingsButton.classList.contains("is-saving")) return;

  saveSettingsButton.classList.remove("is-saving");
  void saveSettingsButton.offsetWidth;
  saveSettingsButton.classList.add("is-saving");
  await new Promise(resolve => window.setTimeout(resolve, prefersReducedMotion ? 0 : 210));

  const changedIndexes = [...settingsAccounts.querySelectorAll(".settings-account-row")]
    .map((row, index) => row.classList.contains("has-amount-change") ? index : -1)
    .filter(index => index >= 0);

  saveFromSettings();

  settingsAccounts.querySelectorAll(".amount-input").forEach(input => {
    input.value = `${formatAmount(parseAmount(input.value))} €`;
  });

  settingsSnapshot = null;
  saveSettingsButton.classList.remove("is-saving");
  await hideOverlayWithAnimation(settingsOverlay, ".settings-panel", "settings-open");

  const cards = [...accountsList.querySelectorAll(".account-card")];
  changedIndexes.forEach(index => {
    const card = cards[index];
    if (!card) return;

    card.classList.remove("is-recently-updated");
    void card.offsetWidth;
    card.classList.add("is-recently-updated");

    window.setTimeout(() => {
      card.classList.remove("is-recently-updated");
    }, 4000);
  });

  showSaveToast();
});
addAccountButton.addEventListener("click", async () => {
  if (addAccountButton.classList.contains("is-saving")) return;

  addAccountButton.classList.remove("is-saving");
  void addAccountButton.offsetWidth;
  addAccountButton.classList.add("is-saving");
  await new Promise(resolve => window.setTimeout(resolve, prefersReducedMotion ? 0 : 210));

  addAccount();
  addAccountButton.classList.remove("is-saving");
});
exportAccountsButton?.addEventListener("click", async () => {
  if (exportAccountsButton.classList.contains("is-saving")) return;

  exportAccountsButton.classList.remove("is-saving");
  void exportAccountsButton.offsetWidth;
  exportAccountsButton.classList.add("is-saving");
  await new Promise(resolve => window.setTimeout(resolve, prefersReducedMotion ? 0 : 210));

  exportAvenirData();
  exportAccountsButton.classList.remove("is-saving");
});

importAccountsButton?.addEventListener("click", async () => {
  if (importAccountsButton.classList.contains("is-saving")) return;

  importAccountsButton.classList.remove("is-saving");
  void importAccountsButton.offsetWidth;
  importAccountsButton.classList.add("is-saving");
  await new Promise(resolve => window.setTimeout(resolve, prefersReducedMotion ? 0 : 210));

  openAvenirImportPicker();
  importAccountsButton.classList.remove("is-saving");
});
importAccountsInput?.addEventListener("change", importAvenirData);

settingsOverlay.addEventListener("click", event => {
  if (event.target === settingsOverlay) closeSettings();
});

settingsAccounts.addEventListener("input", event => {
  if (event.target.classList.contains("amount-input")) {
    event.target.closest(".settings-account-row")?.classList.add("has-amount-change");
  }

  readSettingsValues();
  saveAccounts();
  renderAccounts();
});

settingsAccounts.addEventListener("change", () => {
  readSettingsValues();
  saveAccounts();
  renderAccounts();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !settingsOverlay.hidden) closeSettings();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(error => {
      console.error("Erreur du Service Worker :", error);
    });
  });
}

renderAccounts();
renderLastUpdated();
accountsList.addEventListener("pointerdown", event => {
  const card = event.target.closest(".account-card");
  if (card) card.classList.add("pressed");
});

function clearPressedCards() {
  document.querySelectorAll(".account-card.pressed").forEach(card => {
    card.classList.remove("pressed");
  });
}

document.addEventListener("pointerup", clearPressedCards);
document.addEventListener("pointercancel", clearPressedCards);

/* Ancienne page MSCI supprimée en V11 Alpha 5. */


/* ===== AV€NIR : démarrage direct et accueil préparé hors écran ===== */
let homeTotalRevealAnimated = false;
let homeRevealStarted = false;
const HOME_LOGO_DELAY = 600;
const HOME_CARDS_DELAY = 980;

function animateHomeTotalOnReveal() {
  if (homeTotalRevealAnimated) return;
  homeTotalRevealAnimated = true;

  animateAmount(totalAmount, 0, calculateTotal(), {
    duration: 1150,
    suffix: " €",
    delay: 80
  });
}

function prepareHomeCardsReveal() {
  const cards = [...accountsList.querySelectorAll(".account-card")];
  cards.forEach((card, index) => {
    card.classList.remove("is-home-card-revealing");
    card.classList.add("is-home-card-waiting");
    card.style.setProperty("--home-card-delay", `${index * 65}ms`);
  });
}

function resetHomeAmountsForReveal() {
  totalAmount.textContent = "0,00 €";
  accountsList.querySelectorAll(".account-amount").forEach(element => {
    element.textContent = "0,00";
  });
}

function animateHomeCardAmountsOnReveal() {
  const amountElements = [...accountsList.querySelectorAll(".account-amount")];

  amountElements.forEach((element, index) => {
    animateAmount(element, 0, parseAmount(accounts[index]?.amount), {
      duration: 950,
      delay: HOME_CARDS_DELAY + (index * 65)
    });
  });
}

function revealHomeCardsAfterTotal() {
  const cards = [...accountsList.querySelectorAll(".account-card")];
  cards.forEach(card => {
    card.classList.remove("is-home-card-waiting");
    void card.offsetWidth;
    card.classList.add("is-home-card-revealing");
  });

  window.setTimeout(() => {
    cards.forEach(card => card.classList.remove("is-home-card-revealing"));
  }, 900);
}

function animateHomeLogoLater() {
  const brandLogo = document.querySelector(".brand-logo");

  window.setTimeout(() => {
    brandLogo?.classList.remove("is-home-revealing");
    void brandLogo?.offsetWidth;
    brandLogo?.classList.add("is-home-revealing");

    window.setTimeout(() => {
      brandLogo?.classList.remove("is-home-revealing");
    }, 520);
  }, HOME_LOGO_DELAY);
}

function launchHomeSequence() {
  if (homeRevealStarted) return;
  homeRevealStarted = true;

  const appShell = document.querySelector(".app-shell");
  prepareHomeCardsReveal();
  resetHomeAmountsForReveal();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("app-boot", "pin-boot");
      appShell?.removeAttribute("aria-hidden");
      if (appShell) appShell.style.removeProperty("visibility");

      animateHomeTotalOnReveal();
      animateHomeLogoLater();
      animateHomeCardAmountsOnReveal();
      window.setTimeout(revealHomeCardsAfterTotal, HOME_CARDS_DELAY);
    });
  });
}

/* ===== AV€NIR V10.5 : graphique animé et interactif ===== */
const openStatsButton = document.getElementById("openStatsButton");
const closeStatsButton = document.getElementById("closeStatsButton");
const statsOverlay = document.getElementById("statsOverlay");
const assetDonutCanvas = document.getElementById("assetDonutCanvas");
const donutTotal = document.getElementById("donutTotal");
const donutLegend = document.getElementById("donutLegend");

const DONUT_COLORS = [
  "#ff4b0b",
  "#ff6425",
  "#ff7b46",
  "#ff9567",
  "#ffb184",
  "#e94309",
  "#c93a08",
  "#a82f06",
  "#842404"
];

let donutAnimationFrame = null;
let donutSelectedIndex = -1;
let donutCurrentItems = [];
let donutCurrentTotal = 0;

function getDonutItems() {
  const items = accounts
    .map(account => ({
      name: account.name,
      amount: parseAmount(account.amount)
    }))
    .filter(account => account.amount > 0);

  const total = items.reduce((sum, item) => sum + item.amount, 0);
  return { items, total };
}

function drawAssetDonut(items, total, progress = 1) {
  if (!assetDonutCanvas) return;

  const context = assetDonutCanvas.getContext("2d");
  const size = assetDonutCanvas.width;
  const center = size / 2;
  const outerRadius = size * 0.40;
  const innerRadius = size * 0.215;
  const gap = Math.PI / 180 * 1.15;

  context.clearRect(0, 0, size, size);

  if (total <= 0 || items.length === 0) {
    context.beginPath();
    context.arc(center, center, outerRadius, 0, Math.PI * 2);
    context.arc(center, center, innerRadius, 0, Math.PI * 2, true);
    context.fillStyle = "#eeeeee";
    context.fill();
    return;
  }

  const visibleAngle = Math.PI * 2 * Math.max(0, Math.min(1, progress));
  let startAngle = -Math.PI / 2;
  let remainingAngle = visibleAngle;

  items.forEach((item, index) => {
    if (remainingAngle <= 0) return;

    const fullAngle = (item.amount / total) * Math.PI * 2;
    const drawnAngle = Math.min(fullAngle, remainingAngle);

    if (drawnAngle > gap) {
      const segmentStart = startAngle + gap / 2;
      const segmentEnd = startAngle + drawnAngle - gap / 2;
      const middleAngle = (segmentStart + segmentEnd) / 2;
      const selected = index === donutSelectedIndex;
      const offset = selected ? size * 0.055 : 0;
      const offsetX = Math.cos(middleAngle) * offset;
      const offsetY = Math.sin(middleAngle) * offset;

      context.save();
      context.translate(offsetX, offsetY);

      if (donutSelectedIndex >= 0 && !selected) {
        context.globalAlpha = 0.38;
      }

      context.beginPath();
      context.arc(center, center, outerRadius, segmentStart, segmentEnd);
      context.arc(center, center, innerRadius, segmentEnd, segmentStart, true);
      context.closePath();

      const gradient = context.createRadialGradient(
        center - outerRadius * 0.25,
        center - outerRadius * 0.3,
        innerRadius,
        center,
        center,
        outerRadius
      );

      gradient.addColorStop(0, DONUT_COLORS[index % DONUT_COLORS.length]);
      gradient.addColorStop(1, DONUT_COLORS[(index + 1) % DONUT_COLORS.length]);

      context.fillStyle = gradient;
      context.shadowColor = selected ? "rgba(255,75,11,.38)" : "transparent";
      context.shadowBlur = selected ? size * 0.045 : 0;
      context.fill();

      if (selected) {
        context.globalAlpha = 1;
        context.lineWidth = size * 0.008;
        context.strokeStyle = "rgba(255,255,255,.98)";
        context.stroke();
      }

      context.restore();
    }

    startAngle += fullAngle;
    remainingAngle -= fullAngle;
  });
}

function updateDonutCenter({ fromZero = false } = {}) {
  const centerCopy = document.querySelector(".donut-center-copy");
  if (!centerCopy || !donutTotal) return;

  const label = centerCopy.querySelector("span");
  const share = centerCopy.querySelector("small");
  const displayedValue = fromZero ? 0 : readDisplayedAmount(donutTotal);

  if (donutSelectedIndex < 0) {
    if (label) label.textContent = "TOTAL";
    animateAmount(donutTotal, displayedValue, donutCurrentTotal, {
      duration: fromZero ? 900 : 520,
      suffix: " €",
      delay: fromZero ? 560 : 0
    });
    if (share) share.textContent = "100 %";
    return;
  }

  const item = donutCurrentItems[donutSelectedIndex];
  if (!item) return;

  const percentage = donutCurrentTotal > 0
    ? (item.amount / donutCurrentTotal) * 100
    : 0;

  if (label) label.textContent = item.name;
  animateAmount(donutTotal, displayedValue, item.amount, {
    duration: 520,
    suffix: " €"
  });
  if (share) share.textContent = `${percentage.toFixed(1)} %`;
}

function updateDonutLegendSelection() {
  donutLegend?.querySelectorAll(".donut-legend-row").forEach((row, index) => {
    row.classList.toggle("is-selected", index === donutSelectedIndex);
    row.classList.toggle(
      "is-muted",
      donutSelectedIndex >= 0 && index !== donutSelectedIndex
    );
  });
}

function selectDonutSegment(index) {
  donutSelectedIndex = donutSelectedIndex === index ? -1 : index;
  drawAssetDonut(donutCurrentItems, donutCurrentTotal, 1);
  updateDonutCenter();
  updateDonutLegendSelection();
}

function buildDonutLegend(items, total) {
  if (!donutLegend) return;

  donutLegend.innerHTML = "";

  items.forEach((item, index) => {
    const percentage = total > 0 ? (item.amount / total) * 100 : 0;

    const row = document.createElement("div");
    row.className = "donut-legend-row";
    row.dataset.donutIndex = String(index);
    row.style.setProperty("--legend-delay", `${760 + index * 70}ms`);
    row.addEventListener("click", () => selectDonutSegment(index));

    const dot = document.createElement("span");
    dot.className = "donut-dot";
    dot.style.background = DONUT_COLORS[index % DONUT_COLORS.length];

    const label = document.createElement("span");
    label.className = "donut-label";
    label.textContent = item.name;

    const value = document.createElement("span");
    value.className = "donut-value";

    const amount = document.createElement("strong");
    amount.textContent = `${formatAmount(item.amount)} €`;

    const share = document.createElement("small");
    share.textContent = `${percentage.toFixed(1)} %`;

    value.append(amount, share);
    row.append(dot, label, value);
    donutLegend.appendChild(row);
  });
}

function getTouchedDonutIndex(event) {
  if (!assetDonutCanvas || donutCurrentTotal <= 0) return -1;

  const rect = assetDonutCanvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) * (assetDonutCanvas.width / rect.width);
  const y = (event.clientY - rect.top) * (assetDonutCanvas.height / rect.height);

  const center = assetDonutCanvas.width / 2;
  const dx = x - center;
  const dy = y - center;
  const distance = Math.hypot(dx, dy);
  const outerRadius = assetDonutCanvas.width * 0.47;
  const innerRadius = assetDonutCanvas.width * 0.17;

  if (distance < innerRadius || distance > outerRadius) return -1;

  let angle = Math.atan2(dy, dx) + Math.PI / 2;
  if (angle < 0) angle += Math.PI * 2;

  let cursor = 0;

  for (let index = 0; index < donutCurrentItems.length; index += 1) {
    const segmentAngle =
      (donutCurrentItems[index].amount / donutCurrentTotal) * Math.PI * 2;

    if (angle >= cursor && angle < cursor + segmentAngle) {
      return index;
    }

    cursor += segmentAngle;
  }

  return -1;
}

function animateDonutOpening(items, total) {
  if (donutAnimationFrame) {
    cancelAnimationFrame(donutAnimationFrame);
  }

  const duration = 520;
  let startedAt = null;

  function easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  function frame(timestamp) {
    if (startedAt === null) startedAt = timestamp;

    const rawProgress = Math.min((timestamp - startedAt) / duration, 1);
    const easedProgress = easeOutCubic(rawProgress);

    drawAssetDonut(items, total, easedProgress);

    if (rawProgress < 1) {
      donutAnimationFrame = requestAnimationFrame(frame);
    } else {
      donutAnimationFrame = null;
    }
  }

  donutAnimationFrame = requestAnimationFrame(frame);
}

function renderAssetDonut({ animate = false } = {}) {
  if (!donutLegend || !donutTotal) return;

  const { items, total } = getDonutItems();
  donutCurrentItems = items;
  donutCurrentTotal = total;
  donutSelectedIndex = -1;

  buildDonutLegend(items, total);
  updateDonutCenter({ fromZero: animate });
  updateDonutLegendSelection();

  if (animate) {
    drawAssetDonut(items, total, 0);
    requestAnimationFrame(() => animateDonutOpening(items, total));
  } else {
    drawAssetDonut(items, total, 1);
  }
}

function openStats() {
  openStatsButton?.classList.remove("stats-is-turning");
  void openStatsButton?.offsetWidth;
  openStatsButton?.classList.add("stats-is-turning");

  window.setTimeout(() => {
    openStatsButton?.classList.remove("stats-is-turning");
    statsOverlay.hidden = false;
    document.body.classList.add("stats-open");

  const statsPanel = statsOverlay.querySelector(".stats-panel");
  const centerCopy = statsOverlay.querySelector(".donut-center-copy");

  statsPanel?.classList.remove("is-opening");
  centerCopy?.classList.remove("is-sequence-visible");
  void statsPanel?.offsetWidth;

  statsPanel?.classList.add("is-opening");
  renderAssetDonut({ animate: true });

    window.setTimeout(() => {
      centerCopy?.classList.add("is-sequence-visible");
    }, 610);
  }, 180);
}

async function closeStats() {
  if (donutAnimationFrame) {
    cancelAnimationFrame(donutAnimationFrame);
    donutAnimationFrame = null;
  }

  await hideOverlayWithAnimation(statsOverlay, ".stats-panel", "stats-open");
}

assetDonutCanvas?.addEventListener("pointerup", event => {
  const index = getTouchedDonutIndex(event);

  if (index >= 0) {
    selectDonutSegment(index);
  } else {
    donutSelectedIndex = -1;
    drawAssetDonut(donutCurrentItems, donutCurrentTotal, 1);
    updateDonutCenter();
    updateDonutLegendSelection();
  }
});

openStatsButton?.addEventListener("click", openStats);
closeStatsButton?.addEventListener("click", closeStats);

statsOverlay?.addEventListener("click", event => {
  if (event.target === statsOverlay) {
    closeStats();
  }
});



/* ===== AV€NIR V11 ALPHA 5 : fiches comptes premium ===== */
const ACCOUNT_DETAIL_META = {
  "assurance-vie": {
    eyebrow: "FONDS EURO",
    subtitle: "Assurance vie",
    about: "Un support sécurisé de l’assurance vie, destiné à préserver le capital tout en générant des intérêts.",
    stats: []
  },
  "per": {
    eyebrow: "PLAN ÉPARGNE RETRAITE",
    subtitle: "Horizon retraite",
    about: "Une épargne dédiée à la retraite, actuellement orientée vers la sécurité du fonds euro.",
    stats: []
  },
  "msci": {
    eyebrow: "MSCI WORLD",
    subtitle: "Exposition internationale",
    about: "Un support diversifié investi dans de grandes entreprises des pays développés.",
    stats: []
  },
  "revolut": {
    eyebrow: "RÉSERVE DISPONIBLE",
    subtitle: "Trésorerie flexible",
    about: "Une réserve disponible pour absorber une grosse dépense, puis reconstituée progressivement.",
    stats: [
      ["Disponibilité", "Immédiate"],
      ["Utilisation", "Réserve personnelle"],
      ["Objectif", "Souplesse"]
    ]
  },
  "livret-a": {
    eyebrow: "LIVRET A",
    subtitle: "Épargne réglementée",
    about: "Une épargne sécurisée, disponible à tout moment et exonérée d’impôt.",
    stats: [["Taux", "À renseigner"], ["Intérêts", "Calcul annuel"], ["Plafond", "22 950 €"]]
  },
  "ldd": {
    eyebrow: "LDDS",
    subtitle: "Épargne réglementée",
    about: "Une épargne sécurisée et disponible, complémentaire au Livret A.",
    stats: [["Taux", "À renseigner"], ["Intérêts", "Calcul annuel"], ["Plafond", "12 000 €"]]
  },
  "lep": {
    eyebrow: "LEP",
    subtitle: "Épargne réglementée",
    about: "Un livret sécurisé réservé sous conditions de revenus, avec des intérêts exonérés.",
    stats: [["Taux", "À renseigner"], ["Intérêts", "Calcul annuel"], ["Plafond", "10 000 €"]]
  }
};

function accountDetailIcon(iconKey) {
  return ICONS[iconKey] || ICONS.revolut;
}

function closeAccountDetail() {
  const overlay = document.querySelector('.account-detail-overlay');
  if (!overlay) return;
  overlay.classList.add('is-closing');
  document.body.classList.remove('detail-open');
  window.setTimeout(() => overlay.remove(), 260);
}


function enableAccountDetailSwipe(overlay) {
  const sheet = overlay.querySelector('.account-detail-sheet');
  const hero = overlay.querySelector('.premium-hero');
  if (!sheet || !hero) return;

  let active = false;
  let startY = 0;
  let currentY = 0;
  let startTime = 0;
  let activePointerId = null;

  const applyDrag = distance => {
    const y = Math.max(0, distance);
    sheet.style.setProperty('--detail-swipe-y', `${y}px`);
    const progress = Math.min(y / Math.max(sheet.offsetHeight * .68, 1), 1);
    overlay.style.setProperty('--detail-swipe-opacity', String(1 - progress * .82));
  };

  const resetDrag = () => {
    active = false;
    activePointerId = null;
    sheet.classList.remove('is-swiping');
    sheet.style.removeProperty('--detail-swipe-y');
    overlay.style.removeProperty('--detail-swipe-opacity');
  };

  const begin = (clientY, pointerId = null) => {
    active = true;
    activePointerId = pointerId;
    startY = currentY = clientY;
    startTime = performance.now();
    sheet.classList.add('is-swiping');
  };

  const move = clientY => {
    if (!active) return;
    currentY = clientY;
    applyDrag(currentY - startY);
  };

  const finish = () => {
    if (!active) return;
    const distance = Math.max(0, currentY - startY);
    const elapsed = Math.max(performance.now() - startTime, 1);
    const velocity = distance / elapsed;
    const shouldClose = distance >= Math.min(sheet.offsetHeight * .20, 150) || velocity >= .55;

    active = false;
    activePointerId = null;

    if (shouldClose) {
      sheet.classList.remove('is-swiping');
      sheet.style.setProperty('--detail-swipe-y', `${Math.max(distance, sheet.offsetHeight)}px`);
      overlay.style.setProperty('--detail-swipe-opacity', '0');
      window.setTimeout(closeAccountDetail, 30);
      return;
    }

    sheet.classList.remove('is-swiping');
    sheet.classList.add('is-swipe-returning');
    sheet.style.setProperty('--detail-swipe-y', '0px');
    overlay.style.setProperty('--detail-swipe-opacity', '1');
    window.setTimeout(() => {
      sheet.classList.remove('is-swipe-returning');
      resetDrag();
    }, 320);
  };

  if (window.PointerEvent) {
    hero.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (event.target.closest('button')) return;
      begin(event.clientY, event.pointerId);
      try { hero.setPointerCapture(event.pointerId); } catch (_) {}
      event.preventDefault();
    }, { passive: false });

    hero.addEventListener('pointermove', event => {
      if (!active || event.pointerId !== activePointerId) return;
      move(event.clientY);
      event.preventDefault();
    }, { passive: false });

    hero.addEventListener('pointerup', event => {
      if (!active || event.pointerId !== activePointerId) return;
      move(event.clientY);
      finish();
    });

    hero.addEventListener('pointercancel', finish);
  } else {
    hero.addEventListener('touchstart', event => {
      if (event.target.closest('button') || event.touches.length !== 1) return;
      begin(event.touches[0].clientY);
      event.preventDefault();
    }, { passive: false });

    hero.addEventListener('touchmove', event => {
      if (!active || event.touches.length !== 1) return;
      move(event.touches[0].clientY);
      event.preventDefault();
    }, { passive: false });

    hero.addEventListener('touchend', finish, { passive: true });
    hero.addEventListener('touchcancel', finish, { passive: true });
  }
}

function openAccountDetail(account) {
  closeAccountDetail();
  const iconKey = inferIcon(account);
  const meta = ACCOUNT_DETAIL_META[iconKey] || {
    eyebrow: "COMPTE",
    subtitle: "AV€NIR • Vue détaillée",
    about: "Les informations de ce compte sont regroupées ici.",
    stats: [["Type", "Compte personnel"], ["Disponibilité", "À renseigner"], ["Suivi", "Actif"]]
  };

  const overlay = document.createElement('div');
  overlay.className = 'account-detail-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');

  const detailStats = iconKey === 'msci'
    ? [
        ["Date d’ouverture", escapeHtml(msciDetails.openingDate)],
        ["Assureur", escapeHtml(msciDetails.insurer)],
        ["Support", escapeHtml(msciDetails.support)],
        ["Arbitrages", escapeHtml(msciDetails.arbitrages || "À renseigner")]
      ]
    : iconKey === 'revolut'
      ? [
          ["Type de compte", escapeHtml(revolutDetails.accountType)],
          ["Disponibilité", "Immédiate"]
        ]
      : iconKey === 'livret-a'
        ? [
            ["Taux", escapeHtml(livretADetails.interestRate)],
            ["Intérêts", escapeHtml(livretADetails.interests)],
            ["Plafond", escapeHtml(livretADetails.ceiling)]
          ]
        : iconKey === 'ldd'
          ? [
              ["Taux", escapeHtml(lddDetails.interestRate)],
              ["Intérêts", escapeHtml(lddDetails.interests)],
              ["Plafond", escapeHtml(lddDetails.ceiling)]
            ]
          : iconKey === 'assurance-vie'
            ? [
                ["Date d’ouverture", escapeHtml(fondsEuroDetails.openingDate)],
                ["Assureur", escapeHtml(fondsEuroDetails.insurer)],
                ["Support", escapeHtml(fondsEuroDetails.support)]
              ]
            : iconKey === 'per'
              ? [
                  ["Date d’ouverture", escapeHtml(perDetails.openingDate)],
                  ["Assureur", escapeHtml(perDetails.insurer)],
                  ["Type de PER", escapeHtml(perDetails.accountType)]
                ]
              : meta.stats;

  const statsHtml = detailStats.map(([label, value], index) => {
    const detailIcon = label === "Arbitrages"
      ? "⇄"
      : index === 0
        ? "◔"
        : index === 1
          ? "◇"
          : "✓";

    return `
    <article class="premium-info-card" style="--detail-delay:${170 + index * 55}ms">
      <div class="premium-info-icon" aria-hidden="true">${detailIcon}</div>
      <div class="premium-info-copy"><span>${label}</span><strong>${value}</strong></div>
    </article>`;
  }).join('');

  const msciJournal = '';



  overlay.innerHTML = `
    <section class="account-detail-sheet premium-detail-sheet${iconKey === 'msci' ? ' msci-detail-sheet' : iconKey === 'revolut' ? ' revolut-detail-sheet' : iconKey === 'livret-a' ? ' livret-a-detail-sheet' : iconKey === 'ldd' ? ' ldd-detail-sheet' : iconKey === 'assurance-vie' ? ' fonds-euro-detail-sheet' : iconKey === 'per' ? ' per-detail-sheet' : ''}">
      <div class="premium-handle" aria-hidden="true"></div>
      <header class="premium-hero">
        <button class="premium-back" type="button" aria-label="Retour">←</button>
        <div class="premium-account-icon"><img src="${accountDetailIcon(iconKey)}" alt=""></div>
        <p class="premium-eyebrow">${meta.eyebrow}</p>
        <h2>${account.name}</h2>
        <div class="premium-balance">${formatAmount(account.amount)} <span>€</span></div>
        <p class="premium-subtitle">${meta.subtitle}</p>
      </header>
      <div class="premium-detail-body">
        <section class="premium-section" style="--detail-delay:110ms">
          <div class="premium-section-heading"><span>Vue d’ensemble</span><small>Informations principales</small></div>
          <div class="premium-info-grid">${statsHtml}</div>
        </section>
        ${msciJournal}
        <section class="premium-about${iconKey === 'msci' ? ' msci-about' : iconKey === 'revolut' ? ' revolut-about' : iconKey === 'livret-a' ? ' livret-a-about' : iconKey === 'ldd' ? ' ldd-about' : iconKey === 'assurance-vie' ? ' fonds-euro-about' : iconKey === 'per' ? ' per-about' : ''}" style="--detail-delay:350ms">
          <span>À propos</span><p>${iconKey === 'msci' ? escapeHtml(msciDetails.about) : iconKey === 'revolut' ? escapeHtml(revolutDetails.about) : iconKey === 'livret-a' ? escapeHtml(livretADetails.about) : iconKey === 'ldd' ? escapeHtml(lddDetails.about) : iconKey === 'assurance-vie' ? escapeHtml(fondsEuroDetails.about) : iconKey === 'per' ? escapeHtml(perDetails.about) : meta.about}</p>
        </section>
        <div class="premium-safe"><span>●</span> Données enregistrées sur cet appareil</div>
      </div>
    </section>`;

  document.body.appendChild(overlay);
  document.body.classList.add('detail-open');
  requestAnimationFrame(() => overlay.classList.add('is-visible'));

  enableAccountDetailSwipe(overlay);

  overlay.querySelector('.premium-back')?.addEventListener('click', closeAccountDetail);
  overlay.addEventListener('click', event => {
    if (event.target === overlay) closeAccountDetail();
  });

}

accountsList.addEventListener('click', event => {
  const card = event.target.closest('.account-card');
  if (!card) return;
  const cards = [...accountsList.querySelectorAll('.account-card')];
  const index = cards.indexOf(card);
  if (index < 0 || !accounts[index]) return;
  openAccountDetail(accounts[index]);
}, true);

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && document.querySelector('.account-detail-overlay')) closeAccountDetail();
});


/* ===== AV€NIR V12 : protection locale par code PIN ===== */
const AVENIR_PIN_ENABLED_KEY = "avenir-pin-enabled-v1";
const AVENIR_PIN_HASH_KEY = "avenir-pin-hash-v1";
const AVENIR_PIN_LENGTH = 6;

let avenirPinUnlocked = false;
let pinFlow = null;
let pinFlowValue = "";
let pinFlowFirstCode = "";

function isPinProtectionEnabled() {
  return localStorage.getItem(AVENIR_PIN_ENABLED_KEY) === "true" &&
    Boolean(localStorage.getItem(AVENIR_PIN_HASH_KEY));
}

async function hashPin(pin) {
  const value = `AV€NIR|${String(pin)}`;

  if (window.crypto?.subtle && window.TextEncoder) {
    const bytes = new TextEncoder().encode(value);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)]
      .map(byte => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  // Repli déterministe pour les anciens WebView qui ne proposent pas Web Crypto.
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fallback-${(hash >>> 0).toString(16)}`;
}

function vibratePin(pattern = 18) {
  if ("vibrate" in navigator) navigator.vibrate(pattern);
}

function injectPinStyles() {
  if (document.getElementById("avenirPinStyles")) return;

  const style = document.createElement("style");
  style.id = "avenirPinStyles";
  style.textContent = `
    .pin-lock-screen{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:calc(20px + env(safe-area-inset-top)) 22px calc(18px + env(safe-area-inset-bottom));box-sizing:border-box;background:radial-gradient(circle at 88% 7%,rgba(255,255,255,.24) 0 12%,transparent 30%),radial-gradient(circle at 5% 92%,rgba(255,255,255,.12) 0 10%,transparent 28%),linear-gradient(145deg,#ff7b38 0%,#ff4b0b 46%,#df3600 100%);opacity:1;overflow:hidden;transition:opacity .36s ease,visibility .36s ease}
    .pin-lock-screen[hidden]{display:none!important}
    .pin-lock-screen.is-leaving{opacity:0;visibility:hidden}
    .pin-lock-glow{position:absolute;border-radius:999px;pointer-events:none;filter:blur(2px)}
    .pin-lock-glow-one{width:320px;height:320px;right:-170px;top:-115px;background:rgba(255,255,255,.09)}
    .pin-lock-glow-two{width:280px;height:280px;left:-165px;bottom:-105px;background:rgba(255,255,255,.07)}
    .pin-lock-card{position:relative;z-index:1;width:min(100%,390px);max-height:100%;display:flex;flex-direction:column;align-items:center;text-align:center;color:#fff;animation:avenirPinEnter .46s cubic-bezier(.22,.8,.24,1) both}
    .pin-brand{order:1;margin:0 0 10px;color:#fff;font:800 24px/1 Montserrat,system-ui,sans-serif;letter-spacing:.11em;text-shadow:0 5px 20px rgba(111,27,0,.24)}
    .pin-security-label{order:2;display:inline-flex;align-items:center;gap:7px;margin-bottom:16px;padding:7px 11px;border:1px solid rgba(255,255,255,.28);border-radius:999px;background:rgba(255,255,255,.11);color:rgba(255,255,255,.9);font:700 10px/1 Montserrat,system-ui,sans-serif;letter-spacing:.03em;backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px)}
    .pin-security-dot{width:7px;height:7px;border-radius:50%;background:#fff;box-shadow:0 0 0 4px rgba(255,255,255,.13)}
    .pin-lock-emblem{order:3;display:grid!important;place-items:center;width:108px;height:108px;flex:0 0 auto;margin:0 0 17px;border:1.5px solid rgba(255,255,255,.55);border-radius:34px;background:linear-gradient(145deg,rgba(255,255,255,.30),rgba(255,255,255,.12));box-shadow:0 22px 50px rgba(104,25,0,.28),inset 0 1px 0 rgba(255,255,255,.58);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);transition:transform .34s ease,background .34s ease,box-shadow .34s ease}
    .pin-lock-icon{display:block!important;width:72px!important;height:72px!important;overflow:visible;filter:drop-shadow(0 6px 12px rgba(98,22,0,.2))}
    .pin-lock-halo{opacity:.9}
    .pin-lock-shackle,.pin-lock-body,.pin-lock-keyhole{transition:opacity .22s ease,transform .42s cubic-bezier(.2,.85,.25,1)}
    .pin-lock-shackle{transform-origin:65px 43px}
    .pin-lock-success{opacity:0;transform:scale(.72);transform-origin:48px 58px;transition:opacity .22s ease .08s,transform .32s cubic-bezier(.2,.9,.25,1) .08s}
    .pin-lock-card.is-unlocked .pin-lock-emblem{transform:scale(1.08);background:rgba(255,255,255,.31);box-shadow:0 25px 58px rgba(104,25,0,.30),0 0 0 8px rgba(255,255,255,.08)}
    .pin-lock-card.is-unlocked .pin-lock-shackle{transform:translateY(-3px) rotate(27deg)}
    .pin-lock-card.is-unlocked .pin-lock-body,.pin-lock-card.is-unlocked .pin-lock-keyhole{opacity:.18}
    .pin-lock-card.is-unlocked .pin-lock-success{opacity:1;transform:scale(1)}
    .pin-lock-copy{order:4}
    .pin-lock-eyebrow{margin:0 0 7px;color:rgba(255,255,255,.72);font:750 9px/1 Montserrat,system-ui,sans-serif;letter-spacing:.20em}
    .pin-lock-card h2{margin:0;color:#fff;font:800 25px/1.18 Montserrat,system-ui,sans-serif;letter-spacing:-.025em;text-shadow:0 4px 15px rgba(111,27,0,.18)}
    .pin-lock-message{min-height:20px;margin:8px 0 18px;color:rgba(255,255,255,.82);font:600 11px/1.45 Montserrat,system-ui,sans-serif;transition:color .18s ease}
    .pin-dots{order:5;display:flex;justify-content:center;gap:14px;margin:0 0 22px}
    .pin-dots span{width:13px;height:13px;border:2px solid rgba(255,255,255,.82);border-radius:50%;box-sizing:border-box;background:transparent;transform:scale(1);transition:background .15s ease,transform .15s ease,border-color .15s ease,box-shadow .15s ease}
    .pin-dots span.is-filled{background:#fff;border-color:#fff;box-shadow:0 0 0 5px rgba(255,255,255,.12);transform:scale(1.08);animation:avenirDotPop .2s ease}
    .pin-lock-card.is-error .pin-dots span{border-color:#ffd7ca;background:#ffd7ca}
    .pin-keypad-mount{order:6;width:100%}
    .pin-keypad{display:grid;grid-template-columns:repeat(3,72px);justify-content:center;gap:12px 21px}
    .pin-key{width:72px;height:60px;border:1px solid rgba(255,255,255,.34);border-radius:22px;background:rgba(255,255,255,.16);color:#fff;box-shadow:0 9px 24px rgba(104,25,0,.15),inset 0 1px 0 rgba(255,255,255,.27);font:750 21px Montserrat,system-ui,sans-serif;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);transition:transform .11s ease,background .11s ease,box-shadow .11s ease;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
    .pin-key:active{transform:scale(.90);background:rgba(255,255,255,.31);box-shadow:0 3px 10px rgba(104,25,0,.10)}
    .pin-key.pin-key-empty{visibility:hidden}
    .pin-key.pin-key-delete{font-size:20px;color:#fff;background:transparent;border-color:transparent;box-shadow:none}
    .pin-local-note{order:7;margin:15px 0 0;color:rgba(255,255,255,.62);font:600 9px/1.4 Montserrat,system-ui,sans-serif}
    .pin-lock-card.is-error{animation:avenirPinShake .36s ease}
    @keyframes avenirPinEnter{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes avenirDotPop{0%{transform:scale(.65)}70%{transform:scale(1.20)}100%{transform:scale(1.08)}}
    @keyframes avenirPinShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-9px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(4px)}}
    .pin-settings-card{margin:16px 0 2px;padding:16px;border:1px solid rgba(255,75,11,.14);border-radius:18px;background:#fff8f4}
    .pin-settings-heading{display:flex;align-items:center;justify-content:space-between;gap:16px}.pin-settings-copy{text-align:left}.pin-settings-copy strong{display:block;color:#242424;font-size:14px}.pin-settings-copy span{display:block;margin-top:4px;color:#777;font-size:11px;font-weight:600;line-height:1.4}
    .pin-toggle{position:relative;width:48px;height:28px;flex:0 0 auto}.pin-toggle input{position:absolute;opacity:0;pointer-events:none}.pin-toggle-track{position:absolute;inset:0;border-radius:999px;background:#d5d5d7;transition:background .2s ease}.pin-toggle-track::after{content:"";position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.18);transition:transform .2s ease}.pin-toggle input:checked + .pin-toggle-track{background:#ff4b0b}.pin-toggle input:checked + .pin-toggle-track::after{transform:translateX(20px)}
    .pin-change-button{width:100%;margin-top:13px;padding:12px 14px;border:1px solid rgba(255,75,11,.22);border-radius:13px;background:#fff;color:#ff4b0b;font:700 12px Montserrat,system-ui,sans-serif}.pin-change-button[hidden]{display:none!important}
    .pin-setup-overlay{position:fixed;inset:0;z-index:11000;display:flex;align-items:flex-end;justify-content:center;background:rgba(18,18,20,.38);backdrop-filter:blur(5px);padding-top:env(safe-area-inset-top)}.pin-setup-overlay[hidden]{display:none!important}
    .pin-setup-sheet{width:min(100%,520px);box-sizing:border-box;padding:10px 24px calc(24px + env(safe-area-inset-bottom));border-radius:26px 26px 0 0;background:#f7f7f8;box-shadow:0 -16px 45px rgba(0,0,0,.15);text-align:center}.pin-setup-handle{width:42px;height:5px;margin:0 auto 22px;border-radius:99px;background:#d1d1d3}.pin-setup-sheet h3{margin:0;color:#202020;font:700 21px/1.25 Montserrat,system-ui,sans-serif}.pin-setup-message{min-height:21px;margin:8px 0 20px;color:#777;font:600 12px/1.45 Montserrat,system-ui,sans-serif}
    .pin-setup-sheet .pin-dots{order:initial}.pin-setup-sheet .pin-dots span{border-color:#ff4b0b}.pin-setup-sheet .pin-dots span.is-filled{background:#ff4b0b;border-color:#ff4b0b;box-shadow:0 0 0 5px rgba(255,75,11,.1)}.pin-setup-sheet .pin-key{background:#fff;color:#252525;border-color:transparent;box-shadow:0 7px 20px rgba(45,35,30,.08);backdrop-filter:none}.pin-setup-sheet .pin-key:active{background:#fff1ea}.pin-setup-sheet .pin-key.pin-key-delete{color:#ff4b0b;background:transparent;box-shadow:none}.pin-setup-cancel{margin-top:18px;border:0;background:transparent;color:#777;font:700 12px Montserrat,system-ui,sans-serif}
    body.pin-locked{overflow:hidden}
    @media (max-height:760px){.pin-lock-screen{padding-top:calc(8px + env(safe-area-inset-top));padding-bottom:calc(8px + env(safe-area-inset-bottom));overflow-y:auto}.pin-lock-card{justify-content:flex-start}.pin-brand{margin-bottom:6px;font-size:19px}.pin-security-label{margin-bottom:9px;padding:5px 9px}.pin-lock-emblem{width:76px;height:76px;margin-bottom:9px;border-radius:24px}.pin-lock-icon{width:50px!important;height:50px!important}.pin-lock-eyebrow{margin-bottom:4px}.pin-lock-card h2{font-size:20px}.pin-lock-message{margin:5px 0 10px}.pin-dots{margin-bottom:13px;gap:11px}.pin-dots span{width:11px;height:11px}.pin-key{width:66px;height:48px;border-radius:18px}.pin-keypad{grid-template-columns:repeat(3,66px);gap:7px 17px}.pin-local-note{margin-top:8px}}
    @media (prefers-reduced-motion:reduce){.pin-lock-card,.pin-dots span.is-filled,.pin-lock-card.is-error{animation:none!important}}
  `;
  
  style.textContent += `
.pin-lock-brand,.pin-lock-kicker,.pin-lock-title,.pin-lock-subtitle{display:none!important;}
.pin-lock-card{justify-content:flex-start!important;padding-top:24px!important;}
.pin-lock-lock{margin-top:0!important;margin-bottom:20px!important;}
`;
document.head.appendChild(style);
}

function createPinKeypad(target, onDigit, onDelete) {
  target.innerHTML = "";
  const keypad = document.createElement("div");
  keypad.className = "pin-keypad";

  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "delete"].forEach(value => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pin-key";

    if (value === "") {
      button.classList.add("pin-key-empty");
      button.tabIndex = -1;
      button.setAttribute("aria-hidden", "true");
    } else if (value === "delete") {
      button.classList.add("pin-key-delete");
      button.textContent = "⌫";
      button.setAttribute("aria-label", "Effacer le dernier chiffre");
      button.addEventListener("click", onDelete);
    } else {
      button.textContent = value;
      button.setAttribute("aria-label", `Chiffre ${value}`);
      button.addEventListener("click", () => onDigit(value));
    }

    keypad.appendChild(button);
  });

  target.appendChild(keypad);
}

function updatePinDots(container, length) {
  if (!container) return;
  [...container.children].forEach((dot, index) => {
    dot.classList.toggle("is-filled", index < length);
  });
  container.setAttribute("aria-label", `Code saisi : ${length} chiffre${length > 1 ? "s" : ""} sur ${AVENIR_PIN_LENGTH}`);
}

function setUnlockMessage(text, isError = false) {
  const screen = document.getElementById("pinLockScreen");
  const message = screen?.querySelector(".pin-lock-message");
  const card = screen?.querySelector(".pin-lock-card");
  if (message) message.textContent = text;
  if (isError && card) {
    card.classList.remove("is-unlocked");
    card.classList.remove("is-error");
    void card.offsetWidth;
    card.classList.add("is-error");
    window.setTimeout(() => card.classList.remove("is-error"), 420);
  }
}

function closeUnlockScreen() {
  const screen = document.getElementById("pinLockScreen");
  if (!screen) return;

  avenirPinUnlocked = true;
  screen.classList.add("is-leaving");
  window.setTimeout(() => {
    screen.hidden = true;
    screen.classList.remove("is-leaving");
    document.body.classList.remove("pin-locked");

    // L'accueil est préparé intégralement avant d'être rendu visible.
    launchHomeSequence();
  }, 290);
}

async function validateUnlockPin(pin) {
  const expected = localStorage.getItem(AVENIR_PIN_HASH_KEY);
  const supplied = await hashPin(pin);

  if (expected && supplied === expected) {
    const card = document.querySelector("#pinLockScreen .pin-lock-card");
    card?.classList.add("is-unlocked");
    setUnlockMessage("Code correct");
    vibratePin(22);
    window.setTimeout(closeUnlockScreen, 430);
    return true;
  }

  vibratePin([35, 45, 35]);
  setUnlockMessage("Code incorrect. Réessaie.", true);
  return false;
}

function openUnlockScreen() {
  if (!isPinProtectionEnabled()) return;

  const screen = document.getElementById("pinLockScreen");
  const appShell = document.querySelector(".app-shell");
  const dots = document.getElementById("pinDots");
  const card = screen?.querySelector(".pin-lock-card");
  if (!screen || !card || !dots) return;

  let entered = "";
  injectPinStyles();
  screen.hidden = false;
  document.body.classList.add("pin-locked");
  appShell?.setAttribute("aria-hidden", "true");
  if (appShell) appShell.style.visibility = "hidden";
  document.documentElement.classList.remove("app-boot");
  card.classList.remove("is-error", "is-unlocked");
  setUnlockMessage("");
  updatePinDots(dots, 0);

  const keypadMount = card.querySelector(".pin-keypad-mount") || card;
  const existingKeypad = keypadMount.querySelector(".pin-keypad");
  existingKeypad?.remove();

  createPinKeypad(
    keypadMount,
    async digit => {
      if (entered.length >= AVENIR_PIN_LENGTH) return;
      vibratePin(10);
      entered += digit;
      updatePinDots(dots, entered.length);

      if (entered.length === AVENIR_PIN_LENGTH) {
        const candidate = entered;
        entered = "";
        const valid = await validateUnlockPin(candidate);
        if (!valid) {
          window.setTimeout(() => updatePinDots(dots, 0), 180);
        }
      }
    },
    () => {
      entered = entered.slice(0, -1);
      updatePinDots(dots, entered.length);
      vibratePin(8);
    }
  );
}

function ensurePinSetupOverlay() {
  let overlay = document.getElementById("pinSetupOverlay");
  if (overlay) return overlay;

  overlay = document.createElement("div");
  overlay.id = "pinSetupOverlay";
  overlay.className = "pin-setup-overlay";
  overlay.hidden = true;
  overlay.innerHTML = `
    <section class="pin-setup-sheet" role="dialog" aria-modal="true" aria-labelledby="pinSetupTitle">
      <div class="pin-setup-handle" aria-hidden="true"></div>
      <h3 id="pinSetupTitle">Protection par code</h3>
      <p class="pin-setup-message">Saisissez votre code à 6 chiffres</p>
      <div class="pin-dots pin-setup-dots"><span></span><span></span><span></span><span></span><span></span><span></span></div>
      <div class="pin-setup-keypad"></div>
      <button class="pin-setup-cancel" type="button">Annuler</button>
    </section>`;
  document.body.appendChild(overlay);

  overlay.querySelector(".pin-setup-cancel")?.addEventListener("click", cancelPinFlow);
  overlay.addEventListener("click", event => {
    if (event.target === overlay) cancelPinFlow();
  });
  return overlay;
}

function pinFlowCopy() {
  if (!pinFlow) return { title: "Protection par code", message: "" };

  const copies = {
    enableNew: ["Créer le code", "Choisissez un code à 6 chiffres"],
    enableConfirm: ["Confirmer le code", "Saisissez une seconde fois le même code"],
    changeVerify: ["Code actuel", "Saisissez votre code actuel"],
    changeNew: ["Nouveau code", "Choisissez un nouveau code à 6 chiffres"],
    changeConfirm: ["Confirmer le nouveau code", "Saisissez une seconde fois le nouveau code"],
    disableVerify: ["Désactiver la protection", "Saisissez votre code actuel pour confirmer"]
  };
  const [title, message] = copies[pinFlow] || ["Protection par code", "Saisissez votre code à 6 chiffres"];
  return { title, message };
}

function refreshPinFlowView(messageOverride = "", isError = false) {
  const overlay = ensurePinSetupOverlay();
  const title = overlay.querySelector("#pinSetupTitle");
  const message = overlay.querySelector(".pin-setup-message");
  const dots = overlay.querySelector(".pin-setup-dots");
  const sheet = overlay.querySelector(".pin-setup-sheet");
  const copy = pinFlowCopy();

  if (title) title.textContent = copy.title;
  if (message) message.textContent = messageOverride || copy.message;
  updatePinDots(dots, pinFlowValue.length);

  if (isError && sheet) {
    sheet.classList.remove("is-error");
    void sheet.offsetWidth;
    sheet.classList.add("is-error");
    window.setTimeout(() => sheet.classList.remove("is-error"), 420);
  }
}

function cancelPinFlow() {
  const overlay = document.getElementById("pinSetupOverlay");
  if (overlay) overlay.hidden = true;
  pinFlow = null;
  pinFlowValue = "";
  pinFlowFirstCode = "";
  renderPinSettingsPanel();
}

function openPinFlow(flow) {
  injectPinStyles();
  pinFlow = flow;
  pinFlowValue = "";
  pinFlowFirstCode = "";

  const overlay = ensurePinSetupOverlay();
  const keypadHost = overlay.querySelector(".pin-setup-keypad");
  overlay.hidden = false;
  refreshPinFlowView();

  createPinKeypad(
    keypadHost,
    digit => {
      if (pinFlowValue.length >= AVENIR_PIN_LENGTH) return;
      vibratePin(10);
      pinFlowValue += digit;
      refreshPinFlowView();
      if (pinFlowValue.length === AVENIR_PIN_LENGTH) {
        const submitted = pinFlowValue;
        window.setTimeout(() => processPinFlowCode(submitted), 120);
      }
    },
    () => {
      pinFlowValue = pinFlowValue.slice(0, -1);
      refreshPinFlowView();
      vibratePin(8);
    }
  );
}

async function processPinFlowCode(code) {
  const savedHash = localStorage.getItem(AVENIR_PIN_HASH_KEY);

  if (pinFlow === "enableNew") {
    pinFlowFirstCode = code;
    pinFlow = "enableConfirm";
    pinFlowValue = "";
    refreshPinFlowView();
    return;
  }

  if (pinFlow === "enableConfirm") {
    if (code !== pinFlowFirstCode) {
      pinFlow = "enableNew";
      pinFlowValue = "";
      pinFlowFirstCode = "";
      vibratePin([35, 45, 35]);
      refreshPinFlowView("Les deux codes ne correspondent pas. Recommencez.", true);
      return;
    }

    localStorage.setItem(AVENIR_PIN_HASH_KEY, await hashPin(code));
    localStorage.setItem(AVENIR_PIN_ENABLED_KEY, "true");
    vibratePin(25);
    cancelPinFlow();
    return;
  }

  if (pinFlow === "changeVerify" || pinFlow === "disableVerify") {
    if (!savedHash || await hashPin(code) !== savedHash) {
      pinFlowValue = "";
      vibratePin([35, 45, 35]);
      refreshPinFlowView("Code incorrect. Réessaie.", true);
      return;
    }

    if (pinFlow === "disableVerify") {
      localStorage.removeItem(AVENIR_PIN_ENABLED_KEY);
      localStorage.removeItem(AVENIR_PIN_HASH_KEY);
      vibratePin(25);
      cancelPinFlow();
      return;
    }

    pinFlow = "changeNew";
    pinFlowValue = "";
    refreshPinFlowView();
    return;
  }

  if (pinFlow === "changeNew") {
    pinFlowFirstCode = code;
    pinFlow = "changeConfirm";
    pinFlowValue = "";
    refreshPinFlowView();
    return;
  }

  if (pinFlow === "changeConfirm") {
    if (code !== pinFlowFirstCode) {
      pinFlow = "changeNew";
      pinFlowValue = "";
      pinFlowFirstCode = "";
      vibratePin([35, 45, 35]);
      refreshPinFlowView("Les deux codes ne correspondent pas. Recommencez.", true);
      return;
    }

    localStorage.setItem(AVENIR_PIN_HASH_KEY, await hashPin(code));
    localStorage.setItem(AVENIR_PIN_ENABLED_KEY, "true");
    vibratePin(25);
    cancelPinFlow();
  }
}

function renderPinSettingsPanel() {
  const settingsPanel = document.querySelector(".settings-panel");
  const settingsActions = settingsPanel?.querySelector(".settings-actions");
  if (!settingsPanel || !settingsActions) return;

  injectPinStyles();
  let card = settingsPanel.querySelector(".pin-settings-card");
  if (!card) {
    card = document.createElement("section");
    card.className = "pin-settings-card";
    settingsPanel.insertBefore(card, settingsActions);
  }

  const enabled = isPinProtectionEnabled();
  card.innerHTML = `
    <div class="pin-settings-heading">
      <div class="pin-settings-copy">
        <strong>Protection par code</strong>
        <span>${enabled ? "Un code à 6 chiffres est demandé au lancement." : "Ajoute un code à 6 chiffres au lancement."}</span>
      </div>
      <label class="pin-toggle" aria-label="Protection par code">
        <input class="pin-toggle-input" type="checkbox" ${enabled ? "checked" : ""}>
        <span class="pin-toggle-track"></span>
      </label>
    </div>
    <button class="pin-change-button" type="button" ${enabled ? "" : "hidden"}>Modifier le code</button>`;

  const toggle = card.querySelector(".pin-toggle-input");
  const changeButton = card.querySelector(".pin-change-button");

  toggle?.addEventListener("change", () => {
    if (toggle.checked && !enabled) {
      openPinFlow("enableNew");
    } else if (!toggle.checked && enabled) {
      openPinFlow("disableVerify");
    }
  });

  changeButton?.addEventListener("click", () => openPinFlow("changeVerify"));
}

function initializePinProtection() {
  injectPinStyles();
  if (isPinProtectionEnabled()) {
    openUnlockScreen();
  } else {
    avenirPinUnlocked = true;
    launchHomeSequence();
  }
}

initializePinProtection();
