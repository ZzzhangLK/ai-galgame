# LLM-Powered Dynamic Visual Novel Engine

[中文文档](./README_zh.md)

---

> A framework for creating dynamic, AI-generated visual novels and Galgames, where the story, choices, and character reactions are all powered by a Large Language Model.

![ai-galgame-01.png](https://imgtu.com/upload/xzslo1tx/ai-galgame-01)

This project uses React, TypeScript, and a Dify.ai backend to create an immersive, narrative-driven experience. It features a classic visual novel interface and a robust communication protocol with the LLM to ensure structured and reliable story generation.

## ✨ Key Features

-   **Dynamic Narrative**: The story is generated in real-time by an LLM, based on player choices and a persistent game state.
-   **Stateful Characters**: Characters have affection levels that change based on player actions, influencing their dialogue and reactions.
-   **Classic UI**: A familiar visual novel interface featuring a dialogue box and centered choices.
-   **Smart Scrolling**: The dialogue box automatically scrolls with new text but respects user input, stopping auto-scroll when the user manually scrolls up.
-   **Robust AI Communication**: Uses a clear XML-tagged format (`<dialogue>` and `<command>`) to ensure the LLM provides data in a structured and predictable way, preventing format corruption.
-   **Configurable Story**: Define your own world, characters, and opening scene to create a unique story.

## 🛠️ Tech Stack

-   **Framework**: React 19
-   **Build Tool**: Vite
-   **Language**: TypeScript
-   **UI**: Styled-components & Ant Design (for Spin/Alert components)
-   **State Management**: Zustand
-   **Styling**: Sass
-   **Backend**: [Dify.ai](https://dify.ai/) (Cloud or self-hosted)

## 📖 How It Works

The application operates on a structured prompt-response model:

1.  **Frontend**: Manages the UI, game state (affection, flags), and the user-defined **Story Context**.
2.  **API Call**: On each turn, the frontend sends the player's chosen action and the current game state to the Dify API.
3.  **Dify Backend**: Contains a prompt that defines the AI's role as a visual novel director. It takes the user's action and game state to generate the next scene.
4.  **Response Format**: The LLM returns a response wrapped in XML-like tags. The `<dialogue>` tag contains the character's speech, and the `<command>` tag contains a JSON object with game instructions (e.g., change background, update affection, provide new choices).
5.  **Parsing**: The frontend robustly parses this response, updates the game state via Zustand, and renders the new scene.

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   pnpm (or npm/yarn)

### Installation & Setup

1.  **Clone the repository and install dependencies:**
    ```sh
    git clone <repository_url>
    cd ai-galgame
    pnpm install
    ```

2.  **Set up environment variables:**
    Create a `.env` file by copying `.env.example` and add your Dify API URL and Key.
    ```
    VITE_API_URL=https://your-dify-api-url/v1
    VITE_API_KEY=app-your-dify-app-key
    ```

3.  **Configure the Dify Workflow (Critical):**

    This application will not work unless the Dify backend is configured correctly.

    **Part A: Add the Variable**
    -   Go to your Dify application and open the **Workflow**.
    -   Click on the **Start** node.
    -   In the right-hand panel, under the **Variables** section, click **Add Variable**.
    -   Set the **Key** to `creative_prompt` (must be exact).
    -   Set the **Type** to `String`.

    **Part B: Set the Prompt**
    -   Click on the **LLM** node in the workflow.
    -   Copy the entire content of the `DIFY_PROMPT_TEMPLATE.md` file from this project.
    -   Paste it into the **Prompt** field in the LLM node, replacing any existing content.

    **Part C: Publish**
    -   Click the **Publish** button in the top-right corner to save and apply your changes.

4.  **Run the development server:**
    ```sh
    pnpm run dev
    ```

## 🗺️ Roadmap

This project is under active development. Here is a summary of the planned features and improvements:

-   **Phase 1: Core Gameplay Loop**
    -   [x] Implement basic text adventure engine.
    -   [x] Refactor for Galgame-style UI (dialogue box, centered choices).
    -   [x] Implement robust XML-based parsing.
    -   [x] Implement state management for affection levels and story flags.
    -   [x] Implement smart dialogue scrolling.

-   **Phase 2: Rich Media & Interactivity**
    -   [ ] **Character Sprites:** Add support for displaying character sprites on screen based on commands from the LLM.
    -   [ ] **Backgrounds:** Implement dynamic background changes.
    -   [ ] **Audio:** Integrate a BGM and sound effect manager.
    -   [ ] **AI-Generated Assets:** Explore integrating image-generation APIs to create sprites and backgrounds dynamically.

-   **Phase 3: Quality of Life Features**
    -   [ ] Save/Load System.
    -   [ ] Dialogue History (Backlog).
    -   [ ] Character profile screen.