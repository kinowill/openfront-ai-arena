export type ControlRoomSlotKind = "bot" | "human_reserved";

export type ControlRoomBotPreset =
  | "greedy_expand"
  | "local_llm"
  | "remote_api"
  | "human_operator";

export interface ControlRoomSlotConfig {
  slotId: string;
  enabled: boolean;
  label: string;
  slotKind: ControlRoomSlotKind;
  preset: ControlRoomBotPreset;
  model: string | null;
  baseUrl: string | null;
  apiKeyEnv: string | null;
  teamPreference: string | null;
}

export interface ControlRoomSessionConfig {
  mapName: string;
  gameMode: "ffa" | "team";
  teamCount: number;
  tickDelayMs: number;
  maxTicks: number;
  infiniteGold: boolean;
  infiniteTroops: boolean;
  instantBuild: boolean;
  nativeBotCount: number;
  slots: ControlRoomSlotConfig[];
}

export interface ControlRoomMapOption {
  name: string;
  previewUrl: string | null;
}

export interface ControlRoomSessionRuntime {
  status: "idle" | "lobby" | "running" | "stopped" | "completed" | "error";
  activeMatchId: string | null;
  tick: number | null;
  startedAt: string | null;
  stoppedAt: string | null;
  lastError: string | null;
  lastSummary: string | null;
  joinSupport: "control_room_operator" | "openfront_client_lobby";
  joinNotes: string[];
  surfaceUrl: string | null;
  joinUrl: string | null;
  connectedPlayers: number | null;
  requiredPlayers: number | null;
}

export interface ControlRoomLiveMapTile {
  terrain: "land" | "water";
  ownerId: string | null;
}

export interface ControlRoomLiveMap {
  width: number;
  height: number;
  tiles: ControlRoomLiveMapTile[];
  activePlayers: string[];
}

export interface ControlRoomOperatorAction {
  id: string;
  label: string;
  type: string;
  notes: string[];
}

export interface ControlRoomOperatorSlotState {
  playerId: string;
  label: string;
  alive: boolean;
  strategicSummary: string[];
  validActions: ControlRoomOperatorAction[];
}

export interface ControlRoomOperatorPanel {
  available: boolean;
  slots: ControlRoomOperatorSlotState[];
  lastExecutionSummary: string | null;
}

export interface ControlRoomCapabilities {
  canConfigureSlots: boolean;
  canLaunchCustomMatches: boolean;
  canRunRuleBasedBots: boolean;
  canRunLocalLlmBots: boolean;
  canRunRemoteApiBots: boolean;
  canReserveHumanSlots: boolean;
  canJoinLiveMatchDirectly: boolean;
}

export interface ControlRoomSessionSnapshot {
  config: ControlRoomSessionConfig;
  runtime: ControlRoomSessionRuntime;
  liveMap: ControlRoomLiveMap | null;
  operator: ControlRoomOperatorPanel;
  capabilities: ControlRoomCapabilities;
  availableMaps: string[];
  mapOptions: ControlRoomMapOption[];
}
