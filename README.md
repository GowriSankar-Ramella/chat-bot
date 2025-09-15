# AI Chat Bot

A modern, interactive AI-powered chat application built with React, Vite, Apollo Client, and Nhost for authentication and real-time GraphQL backend. The app provides a clean interface for seamless conversations with AI, supports multiple chats, and real-time updates with a premium user experience.

---

## Features

### 🌟 Multi-Chat Support
- **Create, select, and delete chats**: Manage multiple conversation threads with the sidebar chat list.
- **Real-time updates**: New chats and messages appear instantly, thanks to GraphQL subscriptions and polling.

### 🤖 AI Conversations
- **Start new conversations**: Click "New Chat" to begin a fresh dialogue with the AI.
- **Chat messages**: Each chat thread can contain a unique conversation history.
- **Welcome & Getting Started Prompts**: Friendly onboarding messages guide users to start chatting with AI.

### 🏎️ Fast and Responsive UI
- **Modern design**: Gradient backgrounds, animated icons, and stylish transitions.
- **Loading and error states**: Full-screen loaders and error handling provide smooth feedback.

### 🔒 Authentication & User Management
- **Nhost authentication**: Secure login and session management via Nhost.
- **Premium user indicator**: Displays user's email and premium status in the sidebar.
- **Sign out**: Users can log out securely from the sidebar.

### ⚡ Real-Time Experience
- **WebSocket GraphQL subscriptions**: Instant delivery of new messages and chat updates.
- **Status indicators**: "Online" and animated presence dots show connectivity.

### 🛠️ Tech Stack
- **React + Vite**: Fast, modern frontend tooling.
- **Apollo Client**: GraphQL queries, mutations, and subscriptions.
- **Nhost**: Managed backend for authentication and GraphQL endpoint.
- **GraphQL Subscriptions**: Real-time chat updates.

---

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GowriSankar-Ramella/chat-bot.git
   cd chat-bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Set up your Nhost project and configure the following in `.env`:
     ```
     VITE_NHOST_SUBDOMAIN=your-nhost-subdomain
     VITE_NHOST_REGION=your-nhost-region
     ```

4. **Run the app:**
   ```bash
   npm run dev
   ```

---

## Project Structure

- `src/components/ChatList.jsx`: Sidebar for managing chats (create, select, delete).
- `src/components/MessageView.jsx`: Main view for chat messages and AI interaction.
- `src/lib/apollo.js`: Apollo Client setup with WebSocket and HTTP links.
- `src/lib/nhost.js`: Nhost client initialization for auth and backend.
- `src/App.jsx`: Main app logic and authentication flow.

---


## License

MIT

---

*Built  by GowriSankar Ramella*
