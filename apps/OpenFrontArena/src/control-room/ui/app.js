const $ = (selector) => document.querySelector(selector);

const el = {
  statusPill: $("#status-pill"),
  tickPill: $("#tick-pill"),
  sessionStatus: $("#session-status"),
  joinCapability: $("#join-capability"),
  matchId: $("#match-id"),
  mapName: $("#map-name"),
  matchMode: $("#match-mode"),
  playerCount: $("#player-count"),
  entryCount: $("#entry-count"),
  integrations: $("#integrations"),
  playersTable: $("#players-table"),
  decisionFeed: $("#decision-feed"),
  frontList: $("#front-list"),
  eventList: $("#event-list"),
  commentary: $("#commentary"),
  slotEditor: $("#slot-editor"),
  sessionRuntime: $("#session-runtime"),
  operatorPanel: $("#operator-panel"),
  saveSession: $("#save-session"),
  startSession: $("#start-session"),
  stopSession: $("#stop-session"),
  mapInput: $("#map-name-input"),
  mapPreviewImage: $("#map-preview-image"),
  mapPreviewRandom: $("#map-preview-random"),
  mapPreviewTitle: $("#map-preview-title"),
  mapPreviewMeta: $("#map-preview-meta"),
  modeInput: $("#game-mode-input"),
  teamSettings: $("#team-settings"),
  teamCountInput: $("#team-count-input"),
  teamLegend: $("#team-legend"),
  tickDelayInput: $("#tick-delay-input"),
  maxTicksInput: $("#max-ticks-input"),
  infiniteGoldInput: $("#infinite-gold-input"),
  infiniteTroopsInput: $("#infinite-troops-input"),
  instantBuildInput: $("#instant-build-input"),
  liveMap: $("#live-map"),
  mapLegend: $("#map-legend"),
  openSurface: $("#open-surface"),
  reloadSurface: $("#reload-surface"),
  clearLogs: $("#clear-logs"),
  openfrontFrame: $("#openfront-frame"),
  openfrontEmpty: $("#openfront-empty"),
  surfaceUrlLabel: $("#surface-url-label"),
  langFr: $("#lang-fr"),
  langEn: $("#lang-en"),
  addBotSlot: $("#add-bot-slot"),
  addHumanSlot: $("#add-human-slot"),
  addBotBatch: $("#add-bot-batch"),
  botBatchCount: $("#bot-batch-count"),
  nativeBotSummary: $("#native-bot-summary"),
  removeNativeBots: $("#remove-native-bots"),
  clearNativeBots: $("#clear-native-bots"),
};

const I18N = {
  fr: {
    loaded: "Snapshot charge",
    loading: "Chargement",
    unavailable: "Snapshot indisponible",
    connected: "Live connecte",
    updated: "Mise a jour live",
    nav_surface: "Vue OpenFront",
    invalid: "Payload invalide",
    stream_offline: "Flux indisponible",
    join_help:
      "La surface OpenFront et le join humain pointent maintenant vers le vrai lobby de la session.",
    no_players: "Aucun joueur capture dans les logs.",
    no_decisions: "Aucune decision enregistree pour le moment.",
    no_fronts: "Aucun front detecte dans l'etat courant.",
    no_events: "Aucun evenement live disponible.",
    no_commentary: "Le commentateur n'a encore rien publie.",
    no_operator:
      "Aucun slot humain reserve actif. Passe un slot en 'Humain reserve' pour jouer ici.",
    save_done: "Configuration enregistree",
    started: "Session lancee",
    stopped: "Session arretee",
    logs_cleared: "Logs precedents effaces",
    logs_clear_failed: "Impossible d'effacer les logs precedents",
    runtime: "Runtime",
    slot_active: "Actif",
    slot_disabled: "Desactive",
    slot_enable: "Activer",
    slot_disable: "Desactiver",
    slot_remove: "Supprimer",
    slot_status_bot: "Ce slot lancera un bot.",
    slot_status_human: "Ce slot reserve une place humaine dans le lobby.",
    slot_status_off: "Ce slot est ignore tant qu'il reste desactive.",
    slots_limit: "Maximum 8 slots.",
    slot_backend: "Backend",
    slot_name: "Nom",
    slot_type: "Type",
    slot_model: "Modele",
    slot_provider: "Preset provider",
    slot_base_url: "Base URL",
    slot_api_env: "Variable API key",
    slot_api_key_direct: "Cle API directe",
    slot_api_or: "ou",
    slot_secret_mode: "Source secret",
    secret_mode_direct: "Cle directe locale",
    secret_mode_vault: "Secret chiffre",
    secret_mode_env: "Variable d'environnement",
    slot_secret_pick: "Secret enregistre",
    vault_locked: "Coffre verrouille",
    vault_unlocked: "Coffre deverrouille",
    vault_unlock: "Deverrouiller",
    vault_lock: "Verrouiller",
    vault_save_secret: "Sauver dans le coffre",
    vault_delete_secret: "Supprimer le secret",
    vault_empty: "Aucun secret enregistre",
    field_provider_hint_remote: "Choisis un provider ou passe en Custom",
    field_provider_hint_local: "LM Studio, Ollama ou autre endpoint local",
    field_secret_mode_hint_remote: "Direct, coffre chiffre ou env var",
    field_secret_pick_hint_remote: "Selection du secret chiffre local",
    direct_secret_saved: "Cle locale mise a jour",
    vault_secret_saved: "Secret chiffre enregistre",
    vault_secret_deleted: "Secret chiffre supprime",
    vault_unlock_failed: "Impossible de deverrouiller le coffre",
    vault_secret_missing: "Le secret chiffre selectionne est indisponible",
    vault_secret_required: "Le secret chiffre doit etre deverrouille avant test ou lancement",
    field_bot_batch: "Bots en masse",
    add_bot: "Ajouter un bot",
    add_human: "Ajouter un humain",
    button_add_bot_batch: "Ajouter plusieurs bots natifs",
    native_bot_summary: "Bots natifs OpenFront",
    button_remove_native_bots: "Retirer",
    button_clear_native_bots: "Tout retirer",
    no_slots_title: "Aucun slot pour l'instant",
    no_slots_body:
      "Commence par ajouter un bot ou un humain. Tu peux composer la partie librement, puis supprimer les slots qui ne servent plus.",
    slot_kind_bot: "Joue automatiquement via un bot.",
    slot_kind_human: "Reserve une place pour une personne reelle dans OpenFront.",
    alive: "En jeu",
    dead: "Elimine",
    reserved_human: "Humain reserve",
    bot: "Bot",
    backend_human: "Operateur humain",
    backend_rule_based: "Bot simple integre",
    defaults_title: "Par defaut",
    defaults_help:
      "Or infini, troupes infinies et construction instantanee sont desactives pour coller a une partie normale.",
    integrations_help_title: "Comment remplir",
    integrations_help_body:
      "Choisis le backend dans un slot puis suis l'aide affichee sous ce slot. Tu n'as pas besoin de deviner les champs.",
    bot_help_greedy:
      "GreedyExpand est le bot integre. Aucun champ supplementaire n'est necessaire.",
    bot_help_local:
      "Local LLM : mets l'URL de ton serveur OpenAI-compatible local et le nom du modele. Exemple typique : base URL LM Studio ou vLLM local.",
    bot_help_remote:
      "Remote API : mets l'URL de l'API compatible OpenAI, le nom du modele, puis choisis soit une cle directe locale, soit un secret chiffre local, soit une variable d'environnement.",
    bot_help_human:
      "Human operator reserve une place humaine. Aucun modele ni URL n'est requis.",
    field_model_hint_local: "Exemple : qwen2.5-7b-instruct",
    field_base_url_hint_local: "Exemple : http://127.0.0.1:1234/v1",
    field_model_hint_remote: "Exemple : gpt-4o-mini",
    field_base_url_hint_remote: "Exemple : https://api.openai.com/v1",
    field_api_env_hint_remote: "Exemple : OPENAI_API_KEY",
    field_api_key_direct_hint_remote: "Collee ici, masque et non sauvegardee",
    test_connection: "Tester la connexion",
    testing_connection: "Test en cours...",
    connection_idle: "Aucun test lance.",
    connection_ok: "Connexion OK",
    connection_warning: "Connexion partielle",
    connection_error: "Connexion en erreur",
    no_surface_active: "Aucune vue de match active pour l'instant.",
    available_actions: "Actions disponibles",
    last_operator_action: "Derniere action operateur",
    water: "Eau",
    neutral: "Neutre",
    play: "Jouer",
    surface_open: "Ouvrir dans un onglet",
    surface_reload: "Recharger la vue",
    button_clear_logs: "Effacer les logs precedents",
    field_team_count: "Equipes",
    slot_team: "Equipe",
    team_random: "Aleatoire",
    team_setup_title: "Equipes",
    team_setup_help:
      "OpenFront creera ce nombre d'equipes colorees. Chaque slot peut viser une couleur ou rester en aleatoire.",
    map_preview_label: "Apercu carte",
    map_preview_random_title: "Carte aleatoire",
    map_preview_random_body:
      "La carte sera choisie aleatoirement au lancement parmi les cartes disponibles.",
    random_map_option: "Aleatoire",
    native_bots_team_note:
      "Les bots natifs OpenFront rejoignent ensuite la repartition d'equipes du moteur.",
    map: "Carte",
    mode: "Mode",
    players: "Joueurs",
    logs: "Logs",
    team_red: "Rouge",
    team_blue: "Bleu",
    team_teal: "Sarcelle",
    team_purple: "Violet",
    team_yellow: "Jaune",
    team_orange: "Orange",
    team_green: "Vert",
  },
  en: {
    loaded: "Snapshot loaded",
    loading: "Loading",
    unavailable: "Snapshot unavailable",
    connected: "Live connected",
    updated: "Live updated",
    nav_surface: "OpenFront View",
    invalid: "Invalid payload",
    stream_offline: "Live stream unavailable",
    join_help:
      "The OpenFront surface and human join now point to the real session lobby.",
    no_players: "No players were captured in the logs.",
    no_decisions: "No bot decisions have been recorded yet.",
    no_fronts: "No active fronts were detected in the current state.",
    no_events: "No live events are available right now.",
    no_commentary: "No live commentary has been published yet.",
    no_operator:
      "There is no active reserved human slot. Switch a slot to 'Reserved human' to play from here.",
    save_done: "Configuration saved",
    started: "Session started",
    stopped: "Session stopped",
    logs_cleared: "Previous logs cleared",
    logs_clear_failed: "Could not clear previous logs",
    runtime: "Runtime",
    slot_active: "Active",
    slot_disabled: "Disabled",
    slot_enable: "Enable",
    slot_disable: "Disable",
    slot_remove: "Remove",
    slot_status_bot: "This slot will run a bot.",
    slot_status_human: "This slot reserves a human seat in the lobby.",
    slot_status_off: "This slot is ignored until it is enabled.",
    slots_limit: "Maximum 8 slots.",
    slot_backend: "Backend",
    slot_name: "Name",
    slot_type: "Type",
    slot_model: "Model",
    slot_provider: "Provider preset",
    slot_base_url: "Base URL",
    slot_api_env: "API key env var",
    slot_api_key_direct: "Direct API key",
    slot_api_or: "or",
    slot_secret_mode: "Secret source",
    secret_mode_direct: "Local direct key",
    secret_mode_vault: "Encrypted secret",
    secret_mode_env: "Environment variable",
    slot_secret_pick: "Saved secret",
    vault_locked: "Vault locked",
    vault_unlocked: "Vault unlocked",
    vault_unlock: "Unlock",
    vault_lock: "Lock",
    vault_save_secret: "Save to vault",
    vault_delete_secret: "Delete secret",
    vault_empty: "No saved secrets",
    field_provider_hint_remote: "Choose a provider or switch to Custom",
    field_provider_hint_local: "LM Studio, Ollama, or another local endpoint",
    field_secret_mode_hint_remote: "Direct, encrypted vault, or env var",
    field_secret_pick_hint_remote: "Select a locally encrypted secret",
    direct_secret_saved: "Local key updated",
    vault_secret_saved: "Encrypted secret saved",
    vault_secret_deleted: "Encrypted secret deleted",
    vault_unlock_failed: "Could not unlock vault",
    vault_secret_missing: "The selected encrypted secret is unavailable",
    vault_secret_required: "Unlock the encrypted secret before testing or launching",
    field_bot_batch: "Bulk bots",
    add_bot: "Add bot",
    add_human: "Add human",
    button_add_bot_batch: "Add several native bots",
    native_bot_summary: "Native OpenFront bots",
    button_remove_native_bots: "Remove",
    button_clear_native_bots: "Clear all",
    no_slots_title: "No slots yet",
    no_slots_body:
      "Start by adding a bot or a human seat. You can shape the match freely, then remove the slots you no longer need.",
    slot_kind_bot: "Plays automatically through a bot.",
    slot_kind_human: "Reserves a seat for a real person in OpenFront.",
    alive: "Alive",
    dead: "Eliminated",
    reserved_human: "Reserved human",
    bot: "Bot",
    backend_human: "Human operator",
    backend_rule_based: "Built-in simple bot",
    defaults_title: "Default rules",
    defaults_help:
      "Infinite gold, infinite troops, and instant build are disabled to match a normal match setup.",
    integrations_help_title: "How to fill this in",
    integrations_help_body:
      "Choose a backend in a slot, then follow the guidance shown under that slot. You should not have to guess what belongs in each field.",
    bot_help_greedy:
      "GreedyExpand is the built-in bot. No additional fields are required.",
    bot_help_local:
      "Local LLM: enter your local OpenAI-compatible server URL and the model name. Typical examples include LM Studio, Ollama with an OpenAI bridge, or a local vLLM endpoint.",
    bot_help_remote:
      "Remote API: enter the OpenAI-compatible API URL, the model name, then choose either a local direct key, a local encrypted secret, or the environment variable name that stores it.",
    bot_help_human:
      "Human operator reserves a human seat. No model or URL is required.",
    field_model_hint_local: "Example: qwen2.5-7b-instruct",
    field_base_url_hint_local: "Example: http://127.0.0.1:1234/v1",
    field_model_hint_remote: "Example: gpt-4o-mini",
    field_base_url_hint_remote: "Example: https://api.openai.com/v1",
    field_api_env_hint_remote: "Example: OPENAI_API_KEY",
    field_api_key_direct_hint_remote: "Pasted here, masked and not saved",
    test_connection: "Test connection",
    testing_connection: "Testing...",
    connection_idle: "No test has been run yet.",
    connection_ok: "Connection OK",
    connection_warning: "Partial connection",
    connection_error: "Connection error",
    no_surface_active: "No active match view right now.",
    available_actions: "Available actions",
    last_operator_action: "Last operator action",
    water: "Water",
    neutral: "Neutral",
    play: "Play",
    surface_open: "Open in a tab",
    surface_reload: "Reload view",
    button_clear_logs: "Clear previous logs",
    field_team_count: "Teams",
    slot_team: "Team",
    team_random: "Random",
    team_setup_title: "Teams",
    team_setup_help:
      "OpenFront will create this many colored teams. Each slot can target a color or stay random.",
    map_preview_label: "Map preview",
    map_preview_random_title: "Random map",
    map_preview_random_body:
      "The map will be chosen at launch from the available OpenFront map list.",
    random_map_option: "Random",
    native_bots_team_note:
      "Native OpenFront bots then join the game engine team distribution.",
    map: "Map",
    mode: "Mode",
    players: "Players",
    logs: "Logs",
    team_red: "Red",
    team_blue: "Blue",
    team_teal: "Teal",
    team_purple: "Purple",
    team_yellow: "Yellow",
    team_orange: "Orange",
    team_green: "Green",
  },
};

const RANDOM_MAP_VALUE = "__random__";
const TEAM_COLORS = [
  { id: "Red", hex: "#ef4444", labelKey: "team_red" },
  { id: "Blue", hex: "#3b82f6", labelKey: "team_blue" },
  { id: "Teal", hex: "#14b8a6", labelKey: "team_teal" },
  { id: "Purple", hex: "#a855f7", labelKey: "team_purple" },
  { id: "Yellow", hex: "#eab308", labelKey: "team_yellow" },
  { id: "Orange", hex: "#f97316", labelKey: "team_orange" },
  { id: "Green", hex: "#22c55e", labelKey: "team_green" },
];
const DIRECT_SECRET_STORAGE_KEY = "openfront.controlRoom.directSecrets.v1";
const VAULT_STORAGE_KEY = "openfront.controlRoom.secretVault.v1";
const VAULT_PBKDF2_ITERATIONS = 200000;
const LOCAL_PROVIDER_PRESETS = [
  { id: "lm_studio", label: "LM Studio local", baseUrl: "http://127.0.0.1:1234/v1" },
  { id: "ollama", label: "Ollama OpenAI", baseUrl: "http://127.0.0.1:11434/v1" },
  { id: "vllm", label: "vLLM local", baseUrl: "http://127.0.0.1:8000/v1" },
  { id: "custom", label: "Custom", baseUrl: null },
];
const REMOTE_PROVIDER_PRESETS = [
  { id: "openai", label: "OpenAI", baseUrl: "https://api.openai.com/v1" },
  { id: "mistral", label: "Mistral", baseUrl: "https://api.mistral.ai/v1" },
  { id: "openrouter", label: "OpenRouter", baseUrl: "https://openrouter.ai/api/v1" },
  { id: "deepseek", label: "DeepSeek", baseUrl: "https://api.deepseek.com/v1" },
  { id: "groq", label: "Groq", baseUrl: "https://api.groq.com/openai/v1" },
  { id: "together", label: "Together", baseUrl: "https://api.together.xyz/v1" },
  { id: "fireworks", label: "Fireworks", baseUrl: "https://api.fireworks.ai/inference/v1" },
  { id: "custom", label: "Custom", baseUrl: null },
];

let currentLang = "fr";
let latestDashboard = null;
let latestTick = null;
let sessionDirty = false;
let draftSessionConfig = null;
let integrationChecks = {};
let slotApiSecrets = {};
let slotSecretDrafts = {};
let vaultState = {
  store: null,
  unlocked: false,
  passphrase: null,
  secrets: {},
};

const numberFormat = new Intl.NumberFormat("fr-FR");
const percentFormat = new Intl.NumberFormat("fr-FR", {
  style: "percent",
  maximumFractionDigits: 0,
});
const timeFormat = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

function t(key) {
  return I18N[currentLang][key] || key;
}

function loadJsonStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJsonStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota and private browsing failures.
  }
}

function applyI18n() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent =
      node.dataset.i18n in (I18N[currentLang] || {}) ? t(node.dataset.i18n) : node.textContent;
  });
  el.langFr.classList.toggle("is-active", currentLang === "fr");
  el.langEn.classList.toggle("is-active", currentLang === "en");
}

function statusClass(kind) {
  switch (kind) {
    case "online":
    case "configured":
    case "stable":
    case "running":
    case "lobby":
    case "completed":
      return "success";
    case "warning":
    case "waiting":
    case "idle":
    case "stopped":
      return "warning";
    default:
      return "danger";
  }
}

function badge(label, kind) {
  if (kind === "configured") return `<span class="badge badge-configured">${label}</span>`;
  return `<span class="badge badge-${statusClass(kind)}">${label}</span>`;
}

function integrationBadge(status) {
  if (status === "ok") return badge(t("connection_ok"), "configured");
  if (status === "warning") return badge(t("connection_warning"), "warning");
  if (status === "error") return badge(t("connection_error"), "error");
  return badge(t("connection_idle"), "waiting");
}

function setStatus(label, kind) {
  el.statusPill.textContent = label;
  el.statusPill.className = `badge badge-${statusClass(kind)}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function providerPresetsFor(slotPreset) {
  if (slotPreset === "local_llm") return LOCAL_PROVIDER_PRESETS;
  if (slotPreset === "remote_api") return REMOTE_PROVIDER_PRESETS;
  return [{ id: "custom", label: "Custom", baseUrl: null }];
}

function providerPresetBaseUrl(slotPreset, providerPreset) {
  const preset = providerPresetsFor(slotPreset).find((entry) => entry.id === providerPreset);
  return preset?.baseUrl ?? null;
}

function inferProviderPreset(slotPreset, providerPreset, baseUrl) {
  const presets = providerPresetsFor(slotPreset);
  if (providerPreset && presets.some((entry) => entry.id === providerPreset)) {
    return providerPreset;
  }
  const normalizedBaseUrl = (baseUrl || "").trim().replace(/\/$/, "");
  const matchedPreset = presets.find(
    (entry) => entry.baseUrl && entry.baseUrl.replace(/\/$/, "") === normalizedBaseUrl,
  );
  return matchedPreset?.id ?? "custom";
}

function providerOptionsHtml(slotPreset, selectedValue) {
  return providerPresetsFor(slotPreset)
    .map(
      (provider) =>
        `<option value="${provider.id}" ${selectedValue === provider.id ? "selected" : ""}>${escapeHtml(provider.label)}</option>`,
    )
    .join("");
}

function randomHex(size = 16) {
  const bytes = crypto.getRandomValues(new Uint8Array(size));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function bytesToBase64(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function base64ToBytes(value) {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function deriveVaultKey(passphrase, saltBase64) {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: base64ToBytes(saltBase64),
      iterations: VAULT_PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

async function encryptVaultSecret(secret, passphrase, saltBase64) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveVaultKey(passphrase, saltBase64);
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(secret),
  );
  return {
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(cipherBuffer)),
  };
}

async function decryptVaultSecret(entry, passphrase, saltBase64) {
  const key = await deriveVaultKey(passphrase, saltBase64);
  const plainBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBytes(entry.iv) },
    key,
    base64ToBytes(entry.ciphertext),
  );
  return new TextDecoder().decode(plainBuffer);
}

function loadDirectSecrets() {
  slotApiSecrets = loadJsonStorage(DIRECT_SECRET_STORAGE_KEY, {});
}

function persistDirectSecrets() {
  saveJsonStorage(DIRECT_SECRET_STORAGE_KEY, slotApiSecrets);
}

function loadVaultStore() {
  vaultState.store = loadJsonStorage(VAULT_STORAGE_KEY, null);
}

function persistVaultStore() {
  if (vaultState.store) {
    saveJsonStorage(VAULT_STORAGE_KEY, vaultState.store);
  }
}

function vaultEntries() {
  return Object.values(vaultState.store?.entries || {}).sort((left, right) =>
    (left.label || "").localeCompare(right.label || ""),
  );
}

function lockVault() {
  vaultState = {
    ...vaultState,
    unlocked: false,
    passphrase: null,
    secrets: {},
  };
}

async function ensureVaultUnlocked() {
  if (vaultState.unlocked && vaultState.passphrase) {
    return true;
  }

  const hasExistingVault = Boolean(vaultState.store?.salt);
  const promptLabel = hasExistingVault
    ? currentLang === "fr"
      ? "Passphrase du coffre local"
      : "Local vault passphrase"
    : currentLang === "fr"
      ? "Cree une passphrase pour le coffre local"
      : "Create a passphrase for the local vault";
  const passphrase = window.prompt(promptLabel, "");
  if (!passphrase) {
    return false;
  }

  const nextStore =
    vaultState.store ||
    {
      version: 1,
      salt: bytesToBase64(crypto.getRandomValues(new Uint8Array(16))),
      entries: {},
    };

  try {
    const nextSecrets = {};
    for (const [secretId, entry] of Object.entries(nextStore.entries || {})) {
      nextSecrets[secretId] = await decryptVaultSecret(entry, passphrase, nextStore.salt);
    }
    vaultState = {
      store: nextStore,
      unlocked: true,
      passphrase,
      secrets: nextSecrets,
    };
    persistVaultStore();
    return true;
  } catch {
    lockVault();
    setStatus(t("vault_unlock_failed"), "offline");
    return false;
  }
}

async function saveSecretToVault(secretId, label, secret) {
  if (!secret) return null;
  const unlocked = await ensureVaultUnlocked();
  if (!unlocked || !vaultState.store || !vaultState.passphrase) {
    return null;
  }

  const targetId = secretId || `vault_${randomHex(8)}`;
  const encrypted = await encryptVaultSecret(secret, vaultState.passphrase, vaultState.store.salt);
  vaultState.store.entries[targetId] = {
    id: targetId,
    label,
    updatedAt: new Date().toISOString(),
    ...encrypted,
  };
  vaultState.secrets[targetId] = secret;
  persistVaultStore();
  return targetId;
}

function deleteVaultSecret(secretId) {
  if (!secretId || !vaultState.store?.entries?.[secretId]) {
    return;
  }
  delete vaultState.store.entries[secretId];
  delete vaultState.secrets[secretId];
  persistVaultStore();
}

function teamChoices(teamCount) {
  return TEAM_COLORS.slice(0, Math.max(2, Math.min(TEAM_COLORS.length, Number(teamCount) || 2)));
}

function teamLabel(teamId) {
  const team = TEAM_COLORS.find((entry) => entry.id === teamId);
  return team ? t(team.labelKey) : teamId;
}

function teamHex(teamId) {
  const team = TEAM_COLORS.find((entry) => entry.id === teamId);
  return team?.hex || "#71717a";
}

function renderEmpty(node, label) {
  node.innerHTML = `<div class="empty-state">${label}</div>`;
}

function formatRatio(value) {
  return typeof value === "number" ? percentFormat.format(Math.max(0, Math.min(1, value))) : "--";
}

function formatTime(value) {
  if (!value) return "--";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "--" : timeFormat.format(date);
}

function playerColor(ownerId) {
  if (!ownerId) return "#27272a"; // dark neutral
  let hash = 0;
  for (let i = 0; i < ownerId.length; i += 1) {
    hash = ownerId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360} 70% 55%)`; // adjusted for dark background
}

function renderLiveMap(liveMap) {
  const ctx = el.liveMap.getContext("2d");
  ctx.clearRect(0, 0, el.liveMap.width, el.liveMap.height);

  if (!liveMap) {
    ctx.fillStyle = "#18181b"; // Match dark mode panel bg
    ctx.fillRect(0, 0, el.liveMap.width, el.liveMap.height);
    ctx.fillStyle = "#52525b"; // Muted text
    ctx.font = "14px Inter";
    ctx.fillText("No live map", 120, 164);
    el.mapLegend.innerHTML = "";
    return;
  }

  const cellWidth = el.liveMap.width / liveMap.width;
  const cellHeight = el.liveMap.height / liveMap.height;

  liveMap.tiles.forEach((tile, index) => {
    const x = index % liveMap.width;
    const y = Math.floor(index / liveMap.width);
    ctx.fillStyle =
      tile.terrain === "water"
        ? "#0284c7" // Deep water blue for dark theme
        : tile.ownerId
          ? playerColor(tile.ownerId)
          : "#27272a"; // Dark neutral for unowned land
    ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
  });

  const owners = [...new Set(liveMap.tiles.map((tile) => tile.ownerId).filter(Boolean))];
  el.mapLegend.innerHTML = `
    <span class="legend-item"><span class="legend-color" style="background:#0284c7"></span>${t("water")}</span>
    <span class="legend-item"><span class="legend-color" style="background:#27272a"></span>${t("neutral")}</span>
    ${owners
      .map((ownerId) => `<span class="legend-item"><span class="legend-color" style="background:${playerColor(ownerId)}"></span>${ownerId}</span>`)
      .join("")}
  `;
}

function renderControlRoom(controlRoom) {
  latestTick = controlRoom.latestTick;
  el.tickPill.textContent =
    latestTick === null ? "Tick --" : `Tick ${numberFormat.format(latestTick)}`;
  el.matchId.textContent = controlRoom.state.match.id;
  el.mapName.textContent = controlRoom.state.match.mapName || "--";
  el.matchMode.textContent = controlRoom.state.match.mode || "--";
  el.playerCount.textContent = numberFormat.format(controlRoom.state.players.length);
  el.entryCount.textContent = numberFormat.format(controlRoom.entries);

  const integrationCards = [
    {
      title: "Local LLM",
      configured: controlRoom.integrations.localLlm.configured,
      endpoint: controlRoom.integrations.localLlm.baseUrl,
      model: controlRoom.integrations.localLlm.model,
      help:
        currentLang === "fr"
          ? "Pour un slot Local LLM : renseigne un modèle et une base URL locale compatible OpenAI."
          : "For a Local LLM slot: provide a model and a local OpenAI-compatible base URL.",
    },
    {
      title: "Remote API",
      configured: controlRoom.integrations.remoteApi.configured,
      endpoint: controlRoom.integrations.remoteApi.baseUrl,
      model: controlRoom.integrations.remoteApi.model,
      help:
        currentLang === "fr"
          ? "Pour un slot Remote API : renseigne modele, base URL, puis choisis soit une cle directe locale, soit un secret chiffre, soit une variable d'environnement."
          : "For a Remote API slot: provide model, base URL, then choose a local direct key, an encrypted secret, or an environment variable.",
    },
  ];
  
  el.integrations.innerHTML = integrationCards
    .map(
      (item) => `
        <div class="feed-item">
          <div class="flex-between mb-2">
            <strong>${item.title}</strong>
            ${badge(item.configured ? "OK" : "...", item.configured ? "configured" : "waiting")}
          </div>
          <div class="text-xs text-muted font-mono mb-2">
            <div>URL: ${item.endpoint || "--"}</div>
            <div>Model: ${item.model || "--"}</div>
          </div>
          <p class="text-xs text-muted mb-0">${item.help}</p>
        </div>
      `,
    )
    .join("");

  if (!controlRoom.state.players.length) {
    el.playersTable.innerHTML = `<tr><td colspan="6"><div class="empty-state">${t("no_players")}</div></td></tr>`;
  } else {
    const maxTiles = Math.max(...controlRoom.state.players.map((player) => player.tilesOwned), 1);
    el.playersTable.innerHTML = controlRoom.state.players
      .map(
        (player) => `
          <tr>
            <td>
              <div class="font-semibold">${player.displayName}</div>
              <div class="text-xs text-muted">${badge(player.alive ? t("alive") : t("dead"), player.alive ? "configured" : "error")}</div>
            </td>
            <td>
              <div class="font-semibold">${numberFormat.format(player.tilesOwned)}</div>
              <div class="progress"><span style="width:${Math.max(4, Math.round((player.tilesOwned / maxTiles) * 100))}%"></span></div>
            </td>
            <td class="mono">${numberFormat.format(player.troops)}</td>
            <td class="mono">${numberFormat.format(player.gold)}</td>
            <td class="mono">${formatRatio(player.reserveRatio)}</td>
            <td>${badge(formatRatio(player.invalidActionRate), player.invalidActionRate > 0 ? "error" : "configured")}</td>
          </tr>
        `,
      )
      .join("");
  }

  if (!controlRoom.state.botDecisions.length) {
    renderEmpty(el.decisionFeed, t("no_decisions"));
  } else {
    el.decisionFeed.innerHTML = controlRoom.state.botDecisions
      .map(
        (record) => `
          <div class="feed-item">
            <div class="flex-between mb-1">
              <span class="font-semibold">${record.playerId}</span>
              ${badge(record.executedActionId || "wait", record.validationErrors.length ? "error" : "configured")}
            </div>
            <div class="text-xs text-muted mono mb-2">Tick ${record.tick} • ${formatTime(record.createdAt)} • conf: ${formatRatio(record.decision?.confidence || 0)}</div>
            <p class="text-sm"><strong>Goal:</strong> ${record.decision?.strategicGoal || "wait"}</p>
            <p class="text-xs text-muted">${record.decision?.tacticalReason || ""}</p>
          </div>
        `,
      )
      .join("");
  }

  if (!controlRoom.state.mapState.highlightedFronts.length) {
    renderEmpty(el.frontList, t("no_fronts"));
  } else {
    el.frontList.innerHTML = controlRoom.state.mapState.highlightedFronts
      .map(
        (front) => `
          <div class="feed-item">
            <div class="flex-between mb-1">
              <strong class="text-sm">${front.label}</strong>
              ${badge(front.status, front.intensity >= 0.65 ? "error" : front.intensity >= 0.35 ? "warning" : "configured")}
            </div>
            <div class="text-xs mono text-muted mb-2">${front.frontId}</div>
            <div class="flex-between text-xs">
              <span>Lead: ${front.leadPlayerId || "--"}</span>
              <span>Intensité: ${formatRatio(front.intensity)}</span>
            </div>
          </div>
        `,
      )
      .join("");
  }

  el.eventList.innerHTML = controlRoom.state.mapState.liveEvents.length
    ? controlRoom.state.mapState.liveEvents.map((event) => `<li>${event}</li>`).join("")
    : `<li class="empty-state mb-0" style="padding:1rem; border:none;">${t("no_events")}</li>`;

  if (!controlRoom.state.commentatorSummaries.length) {
    renderEmpty(el.commentary, t("no_commentary"));
  } else {
    el.commentary.innerHTML = controlRoom.state.commentatorSummaries
      .map(
        (item) => `
          <div class="feed-item">
            <div class="flex-between mb-2">
              <strong class="text-sm">Tick ${item.tick}</strong>
              <span class="text-xs text-muted mono">${formatTime(item.createdAt)}</span>
            </div>
            <ul class="text-sm text-muted" style="padding-left:1rem; margin:0;">
              ${item.lines.map((line) => `<li style="margin-bottom:4px;">${line}</li>`).join("")}
            </ul>
          </div>
        `,
      )
      .join("");
  }
}

function slotSummary(slot) {
  if (slot.slotKind === "human_reserved") return t("slot_kind_human");
  if (slot.preset === "local_llm") return "IA locale";
  if (slot.preset === "remote_api") return "API distante";
  if (slot.preset === "aggressive_frontline") return "Baseline agressive";
  if (slot.preset === "economic_growth") return "Baseline eco";
  if (slot.preset === "naval_pressure") return "Baseline navale";
  return t("backend_rule_based");
}

function backendLabel(slot) {
  if (slot.slotKind === "human_reserved") return t("backend_human");
  if (slot.preset === "local_llm") return "Local LLM";
  if (slot.preset === "remote_api") return "Remote API";
  if (slot.preset === "aggressive_frontline") return "Aggressive";
  if (slot.preset === "economic_growth") return "Economic";
  if (slot.preset === "naval_pressure") return "Naval";
  return "GreedyExpand";
}

function slotHelp(slot) {
  if (slot.slotKind === "human_reserved" || slot.preset === "human_operator") return t("bot_help_human");
  if (slot.preset === "local_llm") return t("bot_help_local");
  if (slot.preset === "remote_api") return t("bot_help_remote");
  if (slot.preset === "aggressive_frontline") return "Baseline axee sur la pression de front et les attaques terrestres.";
  if (slot.preset === "economic_growth") return "Baseline axee sur l'infrastructure, l'upgrade et la croissance.";
  if (slot.preset === "naval_pressure") return "Baseline axee sur les ports et les angles navals.";
  return t("bot_help_greedy");
}

function slotStatus(slot) {
  if (!slot.enabled) return t("slot_status_off");
  if (slot.slotKind === "human_reserved") return t("slot_status_human");
  return t("slot_status_bot");
}

function slotFieldHint(slot, field) {
  if (slot.preset === "local_llm") {
    if (field === "providerPreset") return t("field_provider_hint_local");
    if (field === "model") return t("field_model_hint_local");
    if (field === "baseUrl") return t("field_base_url_hint_local");
  }
  if (slot.preset === "remote_api") {
    if (field === "providerPreset") return t("field_provider_hint_remote");
    if (field === "model") return t("field_model_hint_remote");
    if (field === "baseUrl") return t("field_base_url_hint_remote");
    if (field === "secretMode") return t("field_secret_mode_hint_remote");
    if (field === "secretRef") return t("field_secret_pick_hint_remote");
    if (field === "apiKeyEnv") return t("field_api_env_hint_remote");
    if (field === "apiKeyDirect") return t("field_api_key_direct_hint_remote");
  }
  return "";
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function renderMapPreview(config, mapOptions) {
  const activeMap = mapOptions.find((option) => option.name === config.mapName) || null;

  if (config.mapName === RANDOM_MAP_VALUE || !activeMap) {
    el.mapPreviewImage.classList.add("hidden");
    el.mapPreviewRandom.classList.remove("hidden");
    el.mapPreviewImage.removeAttribute("src");
    el.mapPreviewTitle.textContent = t("map_preview_random_title");
    el.mapPreviewMeta.textContent = t("map_preview_random_body");
    return;
  }

  el.mapPreviewRandom.classList.add("hidden");
  el.mapPreviewImage.classList.remove("hidden");
  if (activeMap.previewUrl) {
    el.mapPreviewImage.src = activeMap.previewUrl;
  } else {
    el.mapPreviewImage.removeAttribute("src");
  }
  el.mapPreviewImage.alt = `${activeMap.name} preview`;
  el.mapPreviewTitle.textContent = activeMap.name;
  el.mapPreviewMeta.textContent = `${t("map")}: ${activeMap.name}`;
}

function renderTeamLegend(config) {
  if (!el.teamLegend) return;
  if (config.gameMode !== "team") {
    el.teamLegend.innerHTML = "";
    return;
  }
  const activeChoices = teamChoices(config.teamCount);
  const slotCounts = new Map();

  (config.slots || []).forEach((slot) => {
    if (!slot.enabled || slot.slotKind !== "bot" && slot.slotKind !== "human_reserved") {
      return;
    }
    const key =
      slot.teamPreference && activeChoices.some((choice) => choice.id === slot.teamPreference)
        ? slot.teamPreference
        : "random";
    slotCounts.set(key, (slotCounts.get(key) || 0) + 1);
  });

  const chips = activeChoices.map((team) => `
    <span class="team-chip">
      <span class="team-chip-dot" style="background:${team.hex}"></span>
      <span>${teamLabel(team.id)}</span>
      <strong>${slotCounts.get(team.id) || 0}</strong>
    </span>
  `);

  chips.push(`
    <span class="team-chip">
      <span class="team-chip-dot" style="background:#71717a"></span>
      <span>${t("team_random")}</span>
      <strong>${slotCounts.get("random") || 0}</strong>
    </span>
  `);

  if (Number(config.nativeBotCount || 0) > 0) {
    chips.push(`
      <span class="team-chip">
        <span class="team-chip-dot" style="background:#f8fafc"></span>
        <span>${escapeHtml(t("native_bot_summary"))}</span>
        <strong>${Number(config.nativeBotCount || 0)}</strong>
      </span>
    `);
  }

  el.teamLegend.innerHTML = chips.join("");
}

function createSlotDraft(kind = "bot") {
  const isHuman = kind === "human_reserved";
  const index =
    (draftSessionConfig?.slots?.length ||
      latestDashboard?.session?.config?.slots?.length ||
      0) + 1;

  return {
    slotId: `slot_${crypto.randomUUID().replace(/-/g, "").slice(0, 8)}`,
    enabled: true,
    label: isHuman ? `Humain ${index}` : `Bot ${index}`,
    slotKind: isHuman ? "human_reserved" : "bot",
    preset: isHuman ? "human_operator" : "greedy_expand",
    providerPreset: null,
    model: null,
    baseUrl: null,
    secretMode: "direct",
    secretRef: null,
    apiKeyEnv: null,
    teamPreference: null,
  };
}

function ensureDraftConfig() {
  if (!draftSessionConfig && latestDashboard?.session?.config) {
    draftSessionConfig = clone(latestDashboard.session.config);
  }
  return draftSessionConfig;
}

function syncSlotShape(slot) {
  const next = { ...slot };

  if (next.slotKind === "human_reserved") {
    next.preset = "human_operator";
    next.providerPreset = null;
    next.model = null;
    next.baseUrl = null;
    next.secretMode = null;
    next.secretRef = null;
    next.apiKeyEnv = null;
  } else if (next.preset === "human_operator") {
    next.preset = "greedy_expand";
  }

  if (
    next.preset === "greedy_expand" ||
    next.preset === "aggressive_frontline" ||
    next.preset === "economic_growth" ||
    next.preset === "naval_pressure"
  ) {
    next.providerPreset = null;
    next.model = null;
    next.baseUrl = null;
    next.secretMode = null;
    next.secretRef = null;
    next.apiKeyEnv = null;
  }

  if (next.preset === "local_llm") {
    next.providerPreset = inferProviderPreset(next.preset, next.providerPreset, next.baseUrl);
    next.apiKeyEnv = null;
    next.secretMode = null;
    next.secretRef = null;
  }

  if (next.preset === "remote_api") {
    next.providerPreset = inferProviderPreset(next.preset, next.providerPreset, next.baseUrl);
    if (next.secretMode !== "env" && next.secretMode !== "direct" && next.secretMode !== "vault") {
      next.secretMode = next.secretRef ? "vault" : next.apiKeyEnv ? "env" : "direct";
    }
    if (next.secretMode === "env") {
      next.secretRef = null;
    }
    if (next.secretMode === "direct") {
      next.secretRef = null;
    }
  }

  if (!next.teamPreference || !TEAM_COLORS.some((team) => team.id === next.teamPreference)) {
    next.teamPreference = null;
  }

  return next;
}

function slotSecret(slot) {
  if (!slot?.slotId) return "";
  if (slot.secretMode === "vault") {
    return slotSecretDrafts[slot.slotId] || vaultState.secrets[slot.secretRef] || "";
  }
  return slotApiSecrets[slot.slotId] || "";
}

function updateSlotSecret(slotId, value, options = {}) {
  if (!slotId) return;
  const persist = options.persist !== false;
  if (value) {
    if (persist) {
      slotApiSecrets = {
        ...slotApiSecrets,
        [slotId]: value,
      };
      persistDirectSecrets();
    } else {
      slotSecretDrafts = {
        ...slotSecretDrafts,
        [slotId]: value,
      };
    }
    return;
  }

  if (persist) {
    const nextSecrets = { ...slotApiSecrets };
    delete nextSecrets[slotId];
    slotApiSecrets = nextSecrets;
    persistDirectSecrets();
    return;
  }

  const nextDrafts = { ...slotSecretDrafts };
  delete nextDrafts[slotId];
  slotSecretDrafts = nextDrafts;
}

function resolveSlotSecret(slot) {
  if (!slot || slot.preset !== "remote_api") return null;
  if (slot.secretMode === "env") return null;
  if (slot.secretMode === "vault") {
    if (!slot.secretRef) return null;
    return slotSecretDrafts[slot.slotId] || vaultState.secrets[slot.secretRef] || null;
  }
  return slotSecret(slot) || null;
}

function slotCard(slot, index, config) {
  const disabledClass = slot.enabled ? "" : "is-disabled";
  const isHuman = slot.slotKind === "human_reserved";
  const showModel = !isHuman && (slot.preset === "local_llm" || slot.preset === "remote_api");
  const showBaseUrl = !isHuman && (slot.preset === "local_llm" || slot.preset === "remote_api");
  const showProviderPreset = !isHuman && (slot.preset === "local_llm" || slot.preset === "remote_api");
  const showApiKeyEnv = !isHuman && slot.preset === "remote_api" && slot.secretMode === "env";
  const showApiKeyDirect = !isHuman && slot.preset === "remote_api" && (slot.secretMode === "direct" || slot.secretMode === "vault");
  const showSecretMode = !isHuman && slot.preset === "remote_api";
  const showVaultSecret = !isHuman && slot.preset === "remote_api" && slot.secretMode === "vault";
  const showTeamChoice = config.gameMode === "team";
  const teamOptions = teamChoices(config.teamCount)
    .map(
      (team) =>
        `<option value="${escapeHtml(team.id)}" ${slot.teamPreference === team.id ? "selected" : ""}>${escapeHtml(teamLabel(team.id))}</option>`,
    )
    .join("");
  const slotCount =
    draftSessionConfig?.slots?.length || latestDashboard?.session?.config?.slots?.length || 0;
  const canRemove = slotCount > 0;
  const canTest = slot.preset === "local_llm" || slot.preset === "remote_api";
  const integrationState = integrationChecks[slot.slotId] || null;
  const providerPreset = inferProviderPreset(slot.preset, slot.providerPreset, slot.baseUrl);
  const vaultOptions = vaultEntries()
    .map(
      (entry) =>
        `<option value="${escapeHtml(entry.id)}" ${slot.secretRef === entry.id ? "selected" : ""}>${escapeHtml(entry.label)}</option>`,
    )
    .join("");
  const vaultStatus = vaultState.unlocked ? t("vault_unlocked") : t("vault_locked");
  const visibleSecretValue = slotSecret(slot);

  return `
    <article class="slot-card ${disabledClass}" data-slot-index="${index}">
      <div class="slot-header">
        <div class="slot-title">
          <label class="switch-control mb-0">
            <input data-field="enabled" type="checkbox" class="peer sr-only" ${slot.enabled ? "checked" : ""} />
            <div class="switch-bg"></div>
          </label>
          <div>
            <div class="slot-name">Slot ${index + 1} <span class="slot-type-badge">${isHuman ? t("reserved_human") : t("bot")}</span></div>
            <div class="text-xs text-muted mt-1">${slotStatus(slot)}</div>
          </div>
        </div>
        ${canRemove ? `<button class="btn btn-ghost btn-sm" data-slot-remove="${index}" type="button"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>` : ""}
      </div>

      <div class="slot-body">
        <div class="form-group">
          <label>${t("slot_name")}</label>
          <input class="input" data-field="label" type="text" value="${slot.label}" placeholder="Bot Alpha" />
        </div>
        <div class="form-group">
          <label>${t("slot_type")}</label>
          <select class="input" data-field="slotKind">
            <option value="bot" ${slot.slotKind === "bot" ? "selected" : ""}>${t("bot")}</option>
            <option value="human_reserved" ${slot.slotKind === "human_reserved" ? "selected" : ""}>${t("reserved_human")}</option>
          </select>
        </div>
        <div class="form-group">
          <label>${t("slot_backend")}</label>
          <select class="input" data-field="preset" ${isHuman ? "disabled" : ""}>
            <option value="greedy_expand" ${slot.preset === "greedy_expand" ? "selected" : ""}>GreedyExpand</option>
            <option value="aggressive_frontline" ${slot.preset === "aggressive_frontline" ? "selected" : ""}>Aggressive Frontline</option>
            <option value="economic_growth" ${slot.preset === "economic_growth" ? "selected" : ""}>Economic Growth</option>
            <option value="naval_pressure" ${slot.preset === "naval_pressure" ? "selected" : ""}>Naval Pressure</option>
            <option value="local_llm" ${slot.preset === "local_llm" ? "selected" : ""}>Local LLM</option>
            <option value="remote_api" ${slot.preset === "remote_api" ? "selected" : ""}>Remote API</option>
            <option value="human_operator" ${slot.preset === "human_operator" ? "selected" : ""}>${t("backend_human")}</option>
          </select>
        </div>

        <div class="form-group" style="${showTeamChoice ? "" : "display:none;"}">
          <label>${t("slot_team")}</label>
          <select class="input" data-field="teamPreference">
            <option value="">${t("team_random")}</option>
            ${teamOptions}
          </select>
        </div>
        <div class="form-group" style="${showProviderPreset ? "" : "display:none;"}">
          <label>${t("slot_provider")} <span class="text-xs font-normal text-muted">(${slotFieldHint(slot, "providerPreset")})</span></label>
          <select class="input" data-field="providerPreset">
            ${providerOptionsHtml(slot.preset, providerPreset)}
          </select>
        </div>
        
        <div class="form-group" style="${showModel ? '' : 'display:none;'}">
          <label>${t("slot_model")} <span class="text-xs font-normal text-muted">(${slotFieldHint(slot, "model")})</span></label>
          <input class="input" data-field="model" type="text" value="${slot.model || ""}" placeholder="${slot.preset === "remote_api" ? "gpt-4o-mini" : "qwen2.5-7b-instruct"}" />
        </div>
        <div class="form-group" style="${showBaseUrl ? '' : 'display:none;'}">
          <label>${t("slot_base_url")} <span class="text-xs font-normal text-muted">(${slotFieldHint(slot, "baseUrl")})</span></label>
          <input class="input" data-field="baseUrl" type="text" value="${slot.baseUrl || ""}" placeholder="${slot.preset === "remote_api" ? "https://api.openai.com/v1" : "http://127.0.0.1:1234/v1"}" />
        </div>
        <div class="form-group" style="${showSecretMode ? "" : "display:none;"}">
          <label>${t("slot_secret_mode")} <span class="text-xs font-normal text-muted">(${slotFieldHint(slot, "secretMode")})</span></label>
          <select class="input" data-field="secretMode">
            <option value="direct" ${slot.secretMode === "direct" ? "selected" : ""}>${t("secret_mode_direct")}</option>
            <option value="vault" ${slot.secretMode === "vault" ? "selected" : ""}>${t("secret_mode_vault")}</option>
            <option value="env" ${slot.secretMode === "env" ? "selected" : ""}>${t("secret_mode_env")}</option>
          </select>
        </div>
        <div class="form-group" style="${showApiKeyDirect ? '' : 'display:none;'}">
          <label>${t("slot_api_key_direct")} <span class="text-xs font-normal text-muted">(${slotFieldHint(slot, "apiKeyDirect")})</span></label>
          <input class="input" data-field="apiKeyDirect" type="password" value="${escapeHtml(visibleSecretValue)}" placeholder="sk-..." autocomplete="off" spellcheck="false" />
        </div>
        <div class="form-group" style="${showVaultSecret ? "" : "display:none;"}">
          <label>${t("slot_secret_pick")} <span class="text-xs font-normal text-muted">(${slotFieldHint(slot, "secretRef")})</span></label>
          <select class="input" data-field="secretRef">
            <option value="">${t("vault_empty")}</option>
            ${vaultOptions}
          </select>
          <div class="slot-inline-actions mt-2">
            <button class="btn btn-outline btn-sm" data-slot-vault-toggle="${index}" type="button">${vaultState.unlocked ? t("vault_lock") : t("vault_unlock")}</button>
            <button class="btn btn-secondary btn-sm" data-slot-vault-save="${index}" type="button">${t("vault_save_secret")}</button>
            <button class="btn btn-ghost btn-sm" data-slot-vault-delete="${index}" type="button" ${slot.secretRef ? "" : "disabled"}>${t("vault_delete_secret")}</button>
          </div>
          <div class="text-xs text-muted mt-1">${vaultStatus}</div>
        </div>
        <div class="form-group" style="${showApiKeyEnv ? '' : 'display:none;'}">
          <label>${t("slot_api_env")} <span class="text-xs font-normal text-muted">(${slotFieldHint(slot, "apiKeyEnv")})</span></label>
          <input class="input" data-field="apiKeyEnv" type="text" value="${slot.apiKeyEnv || ""}" placeholder="OPENAI_API_KEY" />
        </div>
      </div>

      ${canTest ? `
      <div class="slot-footer">
        <div>
          <div class="text-xs text-muted mb-1">${integrationState?.detail || t("connection_idle")}</div>
          ${integrationState?.pending ? badge(t("testing_connection"), "waiting") : integrationBadge(integrationState?.status)}
        </div>
        <button class="btn btn-secondary btn-sm" data-slot-test="${index}" type="button" ${integrationState?.pending ? "disabled" : ""}>${integrationState?.pending ? "..." : t("test_connection")}</button>
      </div>` : ''}
    </article>
  `;
}

function renderSession(session) {
  const config = sessionDirty && draftSessionConfig ? draftSessionConfig : session.config;
  const mapOptions = latestDashboard?.session?.mapOptions ?? session.mapOptions ?? [];
  el.sessionStatus.textContent = session.runtime.status;
  el.sessionStatus.className = `badge badge-${statusClass(session.runtime.status)}`;
  el.joinCapability.textContent = t("join_help");

  if (mapOptions.length > 0) {
    const nextOptions = [
      `<option value="${RANDOM_MAP_VALUE}">${escapeHtml(t("random_map_option"))}</option>`,
      ...mapOptions.map(
        (mapOption) =>
          `<option value="${escapeHtml(mapOption.name)}">${escapeHtml(mapOption.name)}</option>`,
      ),
    ]
      .join("");
    if (el.mapInput.innerHTML !== nextOptions) {
      el.mapInput.innerHTML = nextOptions;
    }
  }
  el.mapInput.value = config.mapName;
  el.modeInput.value = config.gameMode;
  el.teamCountInput.value = String(config.teamCount || 2);
  el.tickDelayInput.value = String(config.tickDelayMs);
  el.maxTicksInput.value = String(config.maxTicks);
  el.infiniteGoldInput.checked = config.infiniteGold;
  el.infiniteTroopsInput.checked = config.infiniteTroops;
  el.instantBuildInput.checked = config.instantBuild;
  renderMapPreview(config, mapOptions);
  el.teamSettings.classList.toggle("hidden", config.gameMode !== "team");
  renderTeamLegend(config);
  if (el.nativeBotSummary) {
    el.nativeBotSummary.textContent = `${t("native_bot_summary")}: ${config.nativeBotCount}`;
  }
  if (el.removeNativeBots) {
    el.removeNativeBots.disabled = Number(config.nativeBotCount || 0) <= 0;
  }
  if (el.clearNativeBots) {
    el.clearNativeBots.disabled = Number(config.nativeBotCount || 0) <= 0;
  }
  el.slotEditor.innerHTML = config.slots.length
    ? config.slots.map((slot, index) => slotCard(slot, index, config)).join("")
    : `
      <div class="empty-state">
        <h4 class="font-semibold mb-2">${t("no_slots_title")}</h4>
        <p>${t("no_slots_body")}</p>
      </div>
    `;

  if (el.addBotSlot) {
    el.addBotSlot.disabled = config.slots.length >= 8;
  }
  if (el.addHumanSlot) {
    el.addHumanSlot.disabled = config.slots.length >= 8;
  }
  if (el.botBatchCount) {
    const remainingSlots = Math.max(0, 8 - config.slots.length);
    const minBatch = remainingSlots >= 2 ? 2 : Math.max(remainingSlots, 1);
    el.botBatchCount.max = String(Math.max(1, remainingSlots));
    el.botBatchCount.min = String(minBatch);
    el.botBatchCount.value = String(
      Math.min(
        Math.max(Number(el.botBatchCount.value || 4), minBatch),
        Math.max(1, remainingSlots),
      ),
    );
    el.botBatchCount.disabled = remainingSlots === 0;
  }
  if (el.addBotBatch) {
    el.addBotBatch.disabled = config.slots.length >= 8;
  }

  el.sessionRuntime.innerHTML = `
    <div class="feed-item mt-4 border-primary">
      <div class="flex-between mb-2">
        <strong class="text-sm">${t("runtime")}</strong>
        ${badge(session.runtime.status, session.runtime.status)}
      </div>
      <div class="stats-grid mb-2" style="grid-template-columns: repeat(4, 1fr);">
        <div><div class="text-xs text-muted">Match</div><div class="mono text-xs">${session.runtime.activeMatchId || "--"}</div></div>
        <div><div class="text-xs text-muted">Tick</div><div class="mono text-xs">${session.runtime.tick || "--"}</div></div>
        <div><div class="text-xs text-muted">Players</div><div class="mono text-xs">${session.runtime.connectedPlayers || "--"}/${session.runtime.requiredPlayers || "--"}</div></div>
        <div><div class="text-xs text-muted">Time</div><div class="mono text-xs">${formatTime(session.runtime.startedAt)}</div></div>
      </div>
      <p class="text-xs text-muted">${session.runtime.lastSummary || "-"}</p>
      ${session.runtime.joinUrl ? `<p class="text-xs mt-2"><strong>Join:</strong> <a href="${session.runtime.joinUrl}" target="_blank" class="text-primary" rel="noopener noreferrer">${session.runtime.joinUrl}</a></p>` : ""}
      ${session.runtime.lastError ? `<p class="text-xs text-error mt-2">${session.runtime.lastError}</p>` : ""}
    </div>
  `;

  const surfaceUrl = session.runtime.surfaceUrl;
  const openableSurfaceUrl = session.runtime.surfaceUrl || session.runtime.joinUrl || null;
  el.surfaceUrlLabel.textContent = openableSurfaceUrl || "--";

  if (surfaceUrl) {
    el.openfrontEmpty.classList.add("hidden");
    el.openfrontFrame.classList.remove("hidden");
    if (el.openfrontFrame.src !== surfaceUrl) {
      el.openfrontFrame.src = surfaceUrl;
    }
  } else {
    el.openfrontEmpty.classList.remove("hidden");
    el.openfrontFrame.classList.add("hidden");
    if (el.openfrontFrame.src !== "about:blank") {
      el.openfrontFrame.src = "about:blank";
    }
  }
  if (el.openSurface) {
    el.openSurface.disabled = !openableSurfaceUrl;
  }
  if (el.reloadSurface) {
    el.reloadSurface.disabled = !surfaceUrl;
  }

  renderLiveMap(session.liveMap);

  if (!session.operator.available) {
    renderEmpty(el.operatorPanel, t("no_operator"));
  } else {
    el.operatorPanel.innerHTML = session.operator.slots
      .map(
        (slot) => `
          <div class="feed-item">
            <div class="flex-between mb-2">
              <strong class="text-sm">${slot.label}</strong>
              ${badge(slot.alive ? t("alive") : t("dead"), slot.alive ? "configured" : "error")}
            </div>
            <ul class="text-sm text-muted mb-3" style="padding-left:1rem;">
              ${slot.strategicSummary.map((line) => `<li>${line}</li>`).join("")}
            </ul>
            <div class="text-xs text-muted mb-2 uppercase tracking-wide">${t("available_actions")}</div>
            <div class="action-grid">
              ${slot.validActions.map((action) => `<button class="btn btn-outline btn-sm" data-player-id="${slot.playerId}" data-action-id="${action.id}" type="button">${action.label}</button>`).join("")}
            </div>
          </div>
        `,
      )
      .join("");
    if (session.operator.lastExecutionSummary) {
      el.operatorPanel.insertAdjacentHTML(
        "beforeend",
        `<div class="feed-item mt-2"><strong class="text-xs">${t("last_operator_action")}</strong><p class="text-sm">${session.operator.lastExecutionSummary}</p></div>`,
      );
    }
  }
}

function collectSessionConfig() {
  const gameMode = el.modeInput.value;
  const sourceSlots = draftSessionConfig?.slots || latestDashboard.session.config.slots;
  const slots = Array.from(el.slotEditor.querySelectorAll("[data-slot-index]")).map((node, index) => {
    const field = (name) => node.querySelector(`[data-field="${name}"]`);
    const secretMode = field("secretMode")?.value || sourceSlots[index].secretMode || "direct";
    updateSlotSecret(sourceSlots[index].slotId, field("apiKeyDirect")?.value || "", {
      persist: secretMode !== "vault",
    });
    return syncSlotShape({
      slotId: sourceSlots[index].slotId,
      enabled: field("enabled").checked,
      label: field("label").value,
      slotKind: field("slotKind").value,
      preset: field("preset").value,
      providerPreset: field("providerPreset")?.value || null,
      model: field("model").value || null,
      baseUrl: field("baseUrl").value || null,
      secretMode: field("secretMode")?.value || null,
      secretRef: field("secretRef")?.value || null,
      apiKeyEnv: field("apiKeyEnv").value || null,
      teamPreference: gameMode === "team" ? field("teamPreference")?.value || null : null,
    });
  });

  return {
    mapName: el.mapInput.value,
    gameMode,
    teamCount: Number(el.teamCountInput?.value || 2),
    tickDelayMs: Number(el.tickDelayInput.value),
    maxTicks: Number(el.maxTicksInput.value),
    infiniteGold: el.infiniteGoldInput.checked,
    infiniteTroops: el.infiniteTroopsInput.checked,
    instantBuild: el.instantBuildInput.checked,
    nativeBotCount:
      Number(
        draftSessionConfig?.nativeBotCount ??
          latestDashboard.session.config.nativeBotCount ??
          0,
      ) || 0,
    slots,
  };
}

async function api(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    ...options,
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function saveSession() {
  const session = await api("/api/session", {
    method: "PUT",
    body: JSON.stringify(collectSessionConfig()),
  });
  latestDashboard.session = session;
  sessionDirty = false;
  draftSessionConfig = clone(session.config);
  renderSession(session);
  setStatus(t("save_done"), "stable");
}

async function startSession() {
  await saveSession();
  const unresolvedVaultSlot = draftSessionConfig?.slots?.find(
    (slot) =>
      slot.enabled &&
      slot.preset === "remote_api" &&
      slot.secretMode === "vault" &&
      !resolveSlotSecret(slot),
  );
  if (unresolvedVaultSlot) {
    setStatus(`${unresolvedVaultSlot.label}: ${t("vault_secret_required")}`, "offline");
    return;
  }
  const session = await api("/api/session/start", {
    method: "POST",
    body: JSON.stringify({
      slotSecrets: (draftSessionConfig?.slots || [])
        .map((slot) => ({
          slotId: slot.slotId,
          apiKey: resolveSlotSecret(slot),
        }))
        .filter((entry) => entry.apiKey),
    }),
  });
  latestDashboard.session = session;
  renderSession(session);
  setStatus(t("started"), "online");
}

async function stopSession() {
  const session = await api("/api/session/stop", { method: "POST" });
  latestDashboard.session = session;
  sessionDirty = false;
  draftSessionConfig = clone(session.config);
  renderSession(session);
  setStatus(t("stopped"), "waiting");
}

async function clearLogs() {
  try {
    const payload = await api("/api/logs/clear", { method: "POST" });
    renderDashboard(payload);
    setStatus(t("logs_cleared"), "stable");
  } catch (error) {
    const detail = error instanceof Error ? error.message : "";
    setStatus(
      detail ? `${t("logs_clear_failed")} (${detail})` : t("logs_clear_failed"),
      "offline",
    );
  }
}

function refreshDraftFromDom() {
  if (!latestDashboard?.session) return;
  ensureDraftConfig();
  draftSessionConfig = collectSessionConfig();
  latestDashboard.session.config = clone(draftSessionConfig);
}

function addSlot(kind) {
  ensureDraftConfig();
  if (draftSessionConfig.slots.length >= 8) {
    return;
  }
  draftSessionConfig.slots.push(createSlotDraft(kind));
  latestDashboard.session.config = clone(draftSessionConfig);
  sessionDirty = true;
  renderSession(latestDashboard.session);
}

function addBotBatch(count) {
  ensureDraftConfig();
  const remainingSlots = Math.max(0, 8 - draftSessionConfig.slots.length);
  const safeCount = Math.max(0, Math.min(remainingSlots, count));
  for (let index = 0; index < safeCount; index += 1) {
    draftSessionConfig.slots.push(createSlotDraft("bot"));
  }
  latestDashboard.session.config = clone(draftSessionConfig);
  sessionDirty = true;
  renderSession(latestDashboard.session);
}

function addNativeBotBatch(count) {
  ensureDraftConfig();
  draftSessionConfig.nativeBotCount = Math.max(
    0,
    Math.min(400, Number(draftSessionConfig.nativeBotCount ?? 0) + count),
  );
  latestDashboard.session.config = clone(draftSessionConfig);
  sessionDirty = true;
  renderSession(latestDashboard.session);
}

function removeNativeBotBatch(count) {
  ensureDraftConfig();
  draftSessionConfig.nativeBotCount = Math.max(
    0,
    Number(draftSessionConfig.nativeBotCount ?? 0) - Math.max(0, count),
  );
  latestDashboard.session.config = clone(draftSessionConfig);
  sessionDirty = true;
  renderSession(latestDashboard.session);
}

function clearNativeBots() {
  ensureDraftConfig();
  draftSessionConfig.nativeBotCount = 0;
  latestDashboard.session.config = clone(draftSessionConfig);
  sessionDirty = true;
  renderSession(latestDashboard.session);
}

function removeSlot(index) {
  ensureDraftConfig();
  if (draftSessionConfig.slots.length <= 0) {
    return;
  }
  const removedSlotId = draftSessionConfig.slots[index]?.slotId;
  draftSessionConfig.slots.splice(index, 1);
  if (removedSlotId) {
    updateSlotSecret(removedSlotId, "");
    updateSlotSecret(removedSlotId, "", { persist: false });
  }
  latestDashboard.session.config = clone(draftSessionConfig);
  sessionDirty = true;
  renderSession(latestDashboard.session);
}

async function executeOperatorAction(playerId, actionId) {
  const session = await api("/api/operator/execute", {
    method: "POST",
    body: JSON.stringify({ playerId, actionId }),
  });
  latestDashboard.session = session;
  renderSession(session);
}

async function testSlotConnection(index) {
  if (!latestDashboard?.session) return;
  refreshDraftFromDom();
  const slot = draftSessionConfig?.slots?.[index];
  if (!slot) return;
  if (slot.preset !== "local_llm" && slot.preset !== "remote_api") return;
  const resolvedApiKey = resolveSlotSecret(slot);
  if (slot.preset === "remote_api" && slot.secretMode === "vault" && !resolvedApiKey) {
    integrationChecks = {
      ...integrationChecks,
      [slot.slotId]: {
        pending: false,
        status: "error",
        detail: t("vault_secret_required"),
      },
    };
    renderSession(latestDashboard.session);
    return;
  }

  integrationChecks = {
    ...integrationChecks,
    [slot.slotId]: {
      pending: true,
      status: null,
      detail: t("testing_connection"),
    },
  };
  renderSession(latestDashboard.session);

  try {
    const result = await api("/api/integrations/check", {
      method: "POST",
      body: JSON.stringify({
        backend: slot.preset,
        baseUrl: slot.baseUrl,
        model: slot.model,
        apiKeyEnv: slot.apiKeyEnv,
        apiKey: resolvedApiKey,
      }),
    });
    integrationChecks = {
      ...integrationChecks,
      [slot.slotId]: {
        pending: false,
        status: result.status,
        detail: result.detail || result.summary,
      },
    };
  } catch (error) {
    integrationChecks = {
      ...integrationChecks,
      [slot.slotId]: {
        pending: false,
        status: "error",
        detail:
          error instanceof Error ? error.message : t("connection_error"),
      },
    };
  }

  renderSession(latestDashboard.session);
}

function applyProviderPresetFromCard(slotCardNode) {
  if (!slotCardNode) return;
  const presetField = slotCardNode.querySelector('[data-field="preset"]');
  const providerField = slotCardNode.querySelector('[data-field="providerPreset"]');
  const baseUrlField = slotCardNode.querySelector('[data-field="baseUrl"]');
  if (!presetField || !providerField || !baseUrlField) return;

  const baseUrl = providerPresetBaseUrl(presetField.value, providerField.value);
  if (baseUrl) {
    baseUrlField.value = baseUrl;
  }
}

function syncProviderSelectionFromBaseUrl(slotCardNode) {
  if (!slotCardNode) return;
  const presetField = slotCardNode.querySelector('[data-field="preset"]');
  const providerField = slotCardNode.querySelector('[data-field="providerPreset"]');
  const baseUrlField = slotCardNode.querySelector('[data-field="baseUrl"]');
  if (!presetField || !providerField || !baseUrlField) return;
  providerField.value = inferProviderPreset(presetField.value, providerField.value, baseUrlField.value);
}

async function toggleVaultLock() {
  if (vaultState.unlocked) {
    lockVault();
    if (latestDashboard?.session) {
      renderSession(latestDashboard.session);
    }
    return;
  }
  const unlocked = await ensureVaultUnlocked();
  if (unlocked && latestDashboard?.session) {
    renderSession(latestDashboard.session);
  }
}

async function saveSlotSecretToVault(index) {
  refreshDraftFromDom();
  const slot = draftSessionConfig?.slots?.[index];
  if (!slot || slot.preset !== "remote_api") return;

  const secretValue = slotSecret(slot);
  if (!secretValue) {
    setStatus(t("vault_secret_missing"), "offline");
    return;
  }

  const currentLabel =
    slot.secretRef && vaultState.store?.entries?.[slot.secretRef]
      ? vaultState.store.entries[slot.secretRef].label
      : slot.label;
  const labelPrompt = currentLang === "fr" ? "Nom du secret chiffre" : "Encrypted secret label";
  const nextLabel = window.prompt(labelPrompt, currentLabel || slot.label || "Remote API");
  if (!nextLabel) {
    return;
  }

  const secretId = await saveSecretToVault(slot.secretRef, nextLabel.trim(), secretValue);
  if (!secretId) {
    return;
  }
  updateSlotSecret(slot.slotId, "", { persist: false });

  draftSessionConfig.slots[index] = syncSlotShape({
    ...slot,
    secretMode: "vault",
    secretRef: secretId,
  });
  latestDashboard.session.config = clone(draftSessionConfig);
  sessionDirty = true;
  setStatus(t("vault_secret_saved"), "stable");
  renderSession(latestDashboard.session);
}

function deleteSlotVaultSecret(index) {
  refreshDraftFromDom();
  const slot = draftSessionConfig?.slots?.[index];
  if (!slot?.secretRef) return;
  deleteVaultSecret(slot.secretRef);
  updateSlotSecret(slot.slotId, "", { persist: false });
  draftSessionConfig.slots[index] = syncSlotShape({
    ...slot,
    secretMode: "direct",
    secretRef: null,
  });
  latestDashboard.session.config = clone(draftSessionConfig);
  sessionDirty = true;
  setStatus(t("vault_secret_deleted"), "stable");
  renderSession(latestDashboard.session);
}

function bind() {
  el.saveSession.addEventListener("click", () => void saveSession());
  el.startSession.addEventListener("click", () => void startSession());
  el.stopSession.addEventListener("click", () => void stopSession());
  el.clearLogs?.addEventListener("click", () => void clearLogs());
  el.addBotSlot?.addEventListener("click", () => addSlot("bot"));
  el.addHumanSlot?.addEventListener("click", () => addSlot("human_reserved"));
  el.addBotBatch?.addEventListener("click", () => {
    const requested = Number(el.botBatchCount?.value || 0);
    if (!Number.isFinite(requested) || requested <= 0) {
      return;
    }
    addNativeBotBatch(requested);
  });
  el.removeNativeBots?.addEventListener("click", () => {
    const requested = Number(el.botBatchCount?.value || 0);
    if (!Number.isFinite(requested) || requested <= 0) {
      return;
    }
    removeNativeBotBatch(requested);
  });
  el.clearNativeBots?.addEventListener("click", () => clearNativeBots());
  [el.mapInput, el.modeInput, el.teamCountInput, el.tickDelayInput, el.maxTicksInput, el.infiniteGoldInput, el.infiniteTroopsInput, el.instantBuildInput].forEach((node) => {
    node.addEventListener("input", () => {
      sessionDirty = true;
      ensureDraftConfig();
      refreshDraftFromDom();
    });
    node.addEventListener("change", () => {
      sessionDirty = true;
      ensureDraftConfig();
      refreshDraftFromDom();
      if (latestDashboard?.session) {
        renderSession(latestDashboard.session);
      }
    });
  });
  el.slotEditor.addEventListener("input", () => {
    sessionDirty = true;
    const activeSlot = document.activeElement?.closest?.("[data-slot-index]");
    if (activeSlot) {
      const slotIndex = Number(activeSlot.dataset.slotIndex);
      const sourceSlot =
        draftSessionConfig?.slots?.[slotIndex] || latestDashboard?.session?.config?.slots?.[slotIndex];
      const directKeyField = activeSlot.querySelector('[data-field="apiKeyDirect"]');
      if (sourceSlot && directKeyField) {
        updateSlotSecret(sourceSlot.slotId, directKeyField.value || "", {
          persist: sourceSlot.secretMode !== "vault",
        });
      }
      const baseUrlField = activeSlot.querySelector('[data-field="baseUrl"]');
      if (baseUrlField && document.activeElement === baseUrlField) {
        syncProviderSelectionFromBaseUrl(activeSlot);
      }
    }
    refreshDraftFromDom();
  });
  el.slotEditor.addEventListener("change", (event) => {
    sessionDirty = true;
    const target = event.target;
    const slotCardNode = target?.closest?.("[data-slot-index]");
    if (slotCardNode) {
      if (target.matches?.('[data-field="providerPreset"]')) {
        applyProviderPresetFromCard(slotCardNode);
      }
      if (target.matches?.('[data-field="preset"]')) {
        const providerField = slotCardNode.querySelector('[data-field="providerPreset"]');
        if (providerField) {
          providerField.innerHTML = providerOptionsHtml(target.value, "custom");
          const fallbackPreset = target.value === "remote_api" ? "openai" : "lm_studio";
          providerField.value = fallbackPreset;
          applyProviderPresetFromCard(slotCardNode);
        }
        const secretModeField = slotCardNode.querySelector('[data-field="secretMode"]');
        if (secretModeField && target.value === "remote_api") {
          secretModeField.value = "direct";
        }
      }
      if (target.matches?.('[data-field="secretMode"]')) {
        const slotIndex = Number(slotCardNode.dataset.slotIndex);
        const sourceSlot =
          draftSessionConfig?.slots?.[slotIndex] || latestDashboard?.session?.config?.slots?.[slotIndex];
        if (sourceSlot && target.value !== "vault") {
          updateSlotSecret(sourceSlot.slotId, "", { persist: false });
        }
      }
      if (target.matches?.('[data-field="secretRef"]')) {
        const slotIndex = Number(slotCardNode.dataset.slotIndex);
        const sourceSlot =
          draftSessionConfig?.slots?.[slotIndex] || latestDashboard?.session?.config?.slots?.[slotIndex];
        if (sourceSlot) {
          updateSlotSecret(sourceSlot.slotId, "", { persist: false });
        }
      }
    }
    if (latestDashboard?.session) {
      refreshDraftFromDom();
      renderSession(latestDashboard.session);
    }
  });
  el.slotEditor.addEventListener("click", async (event) => {
    const removeButton = event.target.closest("[data-slot-remove]");
    if (removeButton) {
      removeSlot(Number(removeButton.dataset.slotRemove));
      return;
    }
    const testButton = event.target.closest("[data-slot-test]");
    if (testButton) {
      void testSlotConnection(Number(testButton.dataset.slotTest));
      return;
    }
    const vaultToggleButton = event.target.closest("[data-slot-vault-toggle]");
    if (vaultToggleButton) {
      await toggleVaultLock();
      return;
    }
    const vaultSaveButton = event.target.closest("[data-slot-vault-save]");
    if (vaultSaveButton) {
      await saveSlotSecretToVault(Number(vaultSaveButton.dataset.slotVaultSave));
      return;
    }
    const vaultDeleteButton = event.target.closest("[data-slot-vault-delete]");
    if (vaultDeleteButton) {
      deleteSlotVaultSecret(Number(vaultDeleteButton.dataset.slotVaultDelete));
    }
  });
  el.operatorPanel.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action-id]");
    if (!button) return;
    void executeOperatorAction(button.dataset.playerId, button.dataset.actionId);
  });
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('is-active'));
      button.classList.add('is-active');
      document.getElementById(button.dataset.target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  el.langFr.addEventListener("click", () => {
    currentLang = "fr";
    applyI18n();
    if (latestDashboard) renderDashboard(latestDashboard);
  });
  el.langEn.addEventListener("click", () => {
    currentLang = "en";
    applyI18n();
    if (latestDashboard) renderDashboard(latestDashboard);
  });
  el.openSurface?.addEventListener("click", () => {
    const targetUrl =
      latestDashboard?.session?.runtime?.surfaceUrl ||
      latestDashboard?.session?.runtime?.joinUrl;
    if (!targetUrl) return;
    const link = document.createElement("a");
    link.href = targetUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  });
  el.reloadSurface?.addEventListener("click", () => {
    const surfaceUrl = latestDashboard?.session?.runtime?.surfaceUrl;
    if (!surfaceUrl) return;
    el.openfrontFrame.src = surfaceUrl;
  });
}

function renderDashboard(payload) {
  if (sessionDirty && draftSessionConfig) {
    payload.session.config = clone(draftSessionConfig);
  } else {
    draftSessionConfig = clone(payload.session.config);
  }

  const active = document.activeElement;
  const isEditingSession =
    sessionDirty &&
    active instanceof HTMLElement &&
    (
      el.slotEditor.contains(active) ||
      active === el.mapInput ||
      active === el.modeInput ||
      active === el.teamCountInput ||
      active === el.tickDelayInput ||
      active === el.maxTicksInput ||
      active === el.infiniteGoldInput ||
      active === el.infiniteTroopsInput ||
      active === el.instantBuildInput
    );

  latestDashboard = payload;
  renderControlRoom(payload.controlRoom);
  if (!isEditingSession) {
    renderSession(payload.session);
  }
}

async function loadInitialState() {
  const payload = await api("/api/dashboard");
  renderDashboard(payload);
  setStatus(t("loaded"), "stable");
}

function openEventStream() {
  const source = new EventSource("/api/events");
  source.onopen = () => setStatus(t("connected"), "online");
  source.onmessage = (event) => {
    try {
      const previousTick = latestTick;
      const payload = JSON.parse(event.data);
      renderDashboard(payload);
      setStatus(
        payload.controlRoom.latestTick === previousTick ? t("connected") : t("updated"),
        "online",
      );
    } catch {
      setStatus(t("invalid"), "warning");
    }
  };
  source.onerror = () => setStatus(t("stream_offline"), "offline");
}

async function bootstrap() {
  applyI18n();
  loadDirectSecrets();
  loadVaultStore();
  bind();
  try {
    setStatus(t("loading"), "waiting");
    await loadInitialState();
  } catch {
    setStatus(t("unavailable"), "offline");
    renderEmpty(el.commentary, t("no_commentary"));
  }
  openEventStream();
}

bootstrap();


