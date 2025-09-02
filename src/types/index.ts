/**
 * A temporary, animated tip displayed on screen to give the player feedback.
 */
export interface GameTip {
  id: number;
  text: string;
}

/**
 * The JSON payload from the LLM, defining all non-dialogue elements of a scene.
 */
export interface SceneCommand {
  location_name?: string;
  background?: string;
  bgm?: string;
  sound_effect?: string;
  tips?: string[]; // Array of human-readable strings to show as tips
  characters?: {
    name: string;
    sprite: string;
    position: 'left' | 'center' | 'right';
  }[];
  choices?: {
    text: string;
    action: string;
  }[];
  state_update?: {
    affection?: Record<string, string>;
    flags?: Record<string, boolean>;
  };
}

/**
 * A complete scene (a single frame) in the game's history.
 */
export interface Scene {
  id: string;
  speaker: string;
  dialogue: string;
  playerChoice?: string;
  command: SceneCommand | null;
}

/**
 * The raw response from the Dify API.
 */
export interface DifyResponse {
  answer: string;
  conversation_id: string;
}

// --- Zustand Store Types ---

export interface GameState {
  storyContext: string;
  conversationId: string | null;
  history: Scene[];
  affection: Record<string, number>;
  flags: Record<string, boolean>;
  isLoading: boolean;
  error: string | null;
  tips: GameTip[];
  lastPayload: string | null;
}

export interface GameActions {
  startGame: (context: string) => void;
  makeChoice: (choiceText: string, choiceAction: string) => void;
  resetGame: () => void;
  removeTip: (id: number) => void;
  retryLastRequest: () => void;
}
