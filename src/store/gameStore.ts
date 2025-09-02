import { create } from 'zustand';
import { streamMessageToDify } from '../api/dify';
import type { GameState, GameActions, Scene, SceneCommand, DifyResponse, GameTip } from '../types';

const SPEAKER_DIALOGUE_SEPARATOR = ':';

const initialState: GameState = {
  storyContext: '',
  conversationId: null,
  history: [],
  affection: {},
  flags: {},
  isLoading: false,
  error: null,
  tips: [],
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,

  removeTip: (id: number) => {
    set((state) => ({ tips: state.tips.filter((tip) => tip.id !== id) }));
  },

  startGame: (context: string) => {
    const placeholderId = `scene-${Date.now()}`;
    const placeholder: Scene = { id: placeholderId, speaker: '旁白', dialogue: '故事正在拉开序幕...', command: null };

    set({ ...initialState, storyContext: context, isLoading: true, history: [placeholder] });

    const { conversationId, storyContext, affection, flags } = get();

    let accumulatedRawResponse = '';
    const onDelta = (chunk: string) => {
      accumulatedRawResponse += chunk;
      set((state) => {
        const history = [...state.history];
        const currentScene = history[history.length - 1];
        if (!currentScene) return state;

        let dialogueContent = '';
        const dialogueMatch = accumulatedRawResponse.match(/<dialogue>([\s\S]*)/);
        if (dialogueMatch) {
          dialogueContent = dialogueMatch[1].split('</dialogue>')[0];
        }

        const parts = dialogueContent.split(SPEAKER_DIALOGUE_SEPARATOR);
        const speaker = parts.length > 1 ? parts[0].trim() : '旁白';
        const dialogue = parts.length > 1 ? parts.slice(1).join(SPEAKER_DIALOGUE_SEPARATOR).trim() : dialogueContent;

        history[history.length - 1] = { ...currentScene, speaker, dialogue };
        return { history };
      });
    };

    const onComplete = (response: DifyResponse) => {
      const fullText = response.answer;
      const dialogueMatch = fullText.match(/<dialogue>([\s\S]*?)<\/dialogue>/);
      const commandMatch = fullText.match(/<command>([\s\S]*?)<\/command>/);

      if (!dialogueMatch || !commandMatch) {
        set({ isLoading: false, error: 'Invalid AI Response: Missing tags.' });
        return;
      }

      const dialogueContent = dialogueMatch[1].trim();
      const commandJson = commandMatch[1].trim();
      const parts = dialogueContent.split(SPEAKER_DIALOGUE_SEPARATOR);
      const speaker = parts.length > 1 ? parts[0].trim() : '旁白';
      const dialogue = parts.length > 1 ? parts.slice(1).join(SPEAKER_DIALOGUE_SEPARATOR).trim() : dialogueContent;

      try {
        const command: SceneCommand = JSON.parse(commandJson);
        const newAffection = { ...get().affection };
        const newFlags = { ...get().flags };
        const newTips: GameTip[] = (command.tips || []).map(tipText => ({ id: Date.now() + Math.random(), text: tipText }));

        if (command.state_update?.affection) {
          for (const char in command.state_update.affection) {
            const changeValue = parseInt(command.state_update.affection[char], 10);
            if (!isNaN(changeValue)) newAffection[char] = (newAffection[char] || 0) + changeValue;
          }
        }
        if (command.state_update?.flags) {
          for (const flag in command.state_update.flags) newFlags[flag] = command.state_update.flags[flag];
        }

        set((state) => ({
          isLoading: false,
          conversationId: response.conversation_id,
          affection: newAffection,
          flags: newFlags,
          tips: [...state.tips, ...newTips],
          history: state.history.map((s) => s.id === placeholderId ? { ...s, speaker, dialogue, command } : s),
        }));
      } catch (e) {
        set({ isLoading: false, error: `Failed to parse JSON command: ${e}` });
      }
    };

    const onError = (error: Error) => set({ isLoading: false, error: error.message });

    const payload = { player_input: { action: 'start_story', text: '开始故事' }, game_state: { affection, flags } };
    streamMessageToDify(JSON.stringify(payload), conversationId, storyContext, onDelta, onComplete, onError);
  },

  resetGame: () => set(initialState),

  makeChoice: (choiceText: string, choiceAction: string) => {
    const { conversationId, storyContext, affection, flags } = get();
    set((state) => ({ isLoading: true, error: null, history: state.history.map((s, i) => i === state.history.length - 1 ? { ...s, playerChoice: choiceText } : s) }));

    const placeholderId = `scene-${Date.now()}`;
    const placeholder: Scene = { id: placeholderId, speaker: '', dialogue: '', command: null };
    set((state) => ({ history: [...state.history, placeholder] }));

    let accumulatedRawResponse = '';
    const onDelta = (chunk: string) => {
      accumulatedRawResponse += chunk;
      set((state) => {
        const history = [...state.history];
        const currentScene = history[history.length - 1];
        if (!currentScene) return state;

        let dialogueContent = '';
        const dialogueMatch = accumulatedRawResponse.match(/<dialogue>([\s\S]*)/);
        if (dialogueMatch) dialogueContent = dialogueMatch[1].split('</dialogue>')[0];

        const parts = dialogueContent.split(SPEAKER_DIALOGUE_SEPARATOR);
        const speaker = parts.length > 1 ? parts[0].trim() : '旁白';
        const dialogue = parts.length > 1 ? parts.slice(1).join(SPEAKER_DIALOGUE_SEPARATOR).trim() : dialogueContent;

        history[history.length - 1] = { ...currentScene, speaker, dialogue };
        return { history };
      });
    };

    const onComplete = (response: DifyResponse) => {
      const fullText = response.answer;
      const dialogueMatch = fullText.match(/<dialogue>([\s\S]*?)<\/dialogue>/);
      const commandMatch = fullText.match(/<command>([\s\S]*?)<\/command>/);

      if (!dialogueMatch || !commandMatch) {
        set({ isLoading: false, error: 'Invalid AI Response: Missing tags.' });
        return;
      }

      const dialogueContent = dialogueMatch[1].trim();
      const commandJson = commandMatch[1].trim();
      const parts = dialogueContent.split(SPEAKER_DIALOGUE_SEPARATOR);
      const speaker = parts.length > 1 ? parts[0].trim() : '旁白';
      const dialogue = parts.length > 1 ? parts.slice(1).join(SPEAKER_DIALOGUE_SEPARATOR).trim() : dialogueContent;

      try {
        const command: SceneCommand = JSON.parse(commandJson);
        const newAffection = { ...get().affection };
        const newFlags = { ...get().flags };
        const newTips: GameTip[] = (command.tips || []).map(tipText => ({ id: Date.now() + Math.random(), text: tipText }));

        if (command.state_update?.affection) {
          for (const char in command.state_update.affection) {
            const changeValue = parseInt(command.state_update.affection[char], 10);
            if (!isNaN(changeValue)) newAffection[char] = (newAffection[char] || 0) + changeValue;
          }
        }
        if (command.state_update?.flags) {
          for (const flag in command.state_update.flags) newFlags[flag] = command.state_update.flags[flag];
        }

        set((state) => ({
          isLoading: false,
          conversationId: response.conversation_id,
          affection: newAffection,
          flags: newFlags,
          tips: [...state.tips, ...newTips],
          history: state.history.map((s) => s.id === placeholderId ? { ...s, speaker, dialogue, command } : s),
        }));
      } catch (e) {
        set({ isLoading: false, error: `Failed to parse JSON command: ${e}` });
      }
    };

    const onError = (error: Error) => set({ isLoading: false, error: error.message });

    const payload = { player_input: { action: choiceAction, text: choiceText }, game_state: { affection, flags } };
    streamMessageToDify(JSON.stringify(payload), conversationId, storyContext, onDelta, onComplete, onError);
  },
}));