// types/index.ts

/**
 * LLM输出的JSON payload部分，定义了一个场景的所有非对话元素。
 */
export interface SceneCommand {
  background?: string;
  bgm?: string;
  sound_effect?: string;
  characters?: {
    name: string;
    sprite: string;
    position: 'left' | 'center' | 'right';
  }[];
  choices?: {
    text: string;
    action: string; // An identifier for the choice
  }[];
  state_update?: {
    affection?: Record<string, string>; // e.g., { "ella": "+1", "lina": "-1" }
    flags?: Record<string, boolean>;
  };
}

/**
 * 代表游戏历史记录中的一个完整场景 (一帧画面)
 */
export interface Scene {
  id: string; // 用于 React key
  speaker: string;
  dialogue: string; // 流式对话文本
  playerChoice?: string; // 玩家在进入此场景前做出的选择
  command: SceneCommand | null; // LLM返回的完整指令，在流式结束后填充
}

/**
 * 代表从 Dify API 返回的原始响应
 */
export interface DifyResponse {
  answer: string;
  conversation_id: string;
}
