# Gyan-Bot: A Multi-lingual Conversational AI

![Gyan-Bot AI Banner](https://placehold.co/1200x400/2563eb/ffffff?text=Gyan-Bot+AI)

<div align="center">

[![Next.js](httpshttps://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![TypeScript](https://imgshields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Genkit](https://img.shields.io/badge/Genkit-purple?logo=google&logoColor=white)](https://developers.google.com/genkit)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-blueviolet?logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-teal?logo=tailwindcss)](https://tailwindcss.com/)

</div>

Gyan-Bot AI is a full-stack conversational chatbot built with Next.js and powered by Google's Gemini models through Genkit. It can answer general knowledge questions, analyze user-uploaded documents (PDFs, text files), and carry on a conversation in five different languages, translating both the user interface and the AI's responses in real-time.

---

## ✨ Key Features

- **Conversational AI Chat**: Engage in natural, context-aware conversations powered by Google Gemini.
- **Document Analysis**: Upload a PDF or text file and ask questions about its content. The AI will read the document to provide accurate answers.
- **Multi-Language Support**: Seamlessly switch between English, Spanish, French, German, and Hindi. The entire UI and all AI responses are translated instantly.
- **Persistent Chat History**: Your conversations are saved locally, allowing you to switch between different chat sessions.
- **Modern & Responsive UI**: A clean, modern interface built with ShadCN UI and Tailwind CSS that works beautifully on both desktop and mobile devices.
- **Real-time Feedback**: Optimistic UI updates and loading indicators provide a smooth user experience during asynchronous AI operations.

---

## 🛠️ Technology Stack

- **Core Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Frontend**: [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **Generative AI**: [Genkit](https://developers.google.com/genkit) with [Google's Gemini](https://deepmind.google/technologies/gemini/) models
- **State Management**: React Hooks (`useActionState`, `useContext`) & Server Actions

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/polyglot-ai.git
    cd polyglot-ai
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of your project. You will need to add your Google AI API key.
    ```env
    GEMINI_API_KEY=YOUR_API_KEY
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

---

## 🧠 AI Flows

This project leverages Genkit to define several AI-powered flows:

- **`generateConversationalResponse`**: Handles general user queries and maintains a conversational context.
- **`answerFromDocument`**: Takes a document and a query, then analyzes the document's content to formulate an answer.
- **`translateText`**: Translates the AI-generated responses into the user's selected language, enabling the multi-language feature.
- **`retrieveRelevantFAQs`**: A flow designed to pull relevant FAQs based on user input (can be extended for FAQ features).
