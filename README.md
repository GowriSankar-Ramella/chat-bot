# Chat Bot Application

A modern, real-time chat bot application built with React and powered by NHost backend services. This application provides a seamless chat experience with user authentication, multiple chat sessions, and real-time messaging capabilities.

## 🚀 Features

- **User Authentication**: Secure email/password authentication using NHost Auth
- **Multiple Chat Sessions**: Create, manage, and switch between multiple chat conversations
- **Real-time Messaging**: Live message updates using GraphQL subscriptions
- **Responsive Design**: Modern, mobile-friendly UI built with TailwindCSS
- **Chat Management**: Create new chats, delete existing chats, and organize conversations
- **Message History**: Persistent message storage with chat history

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework for styling
- **Headless UI** - Accessible UI components
- **Heroicons** - Beautiful hand-crafted SVG icons

### Backend & Services
- **NHost** - Backend-as-a-Service for authentication and database
- **GraphQL** - Query language for API interactions
- **Apollo Client** - Comprehensive GraphQL client with caching
- **GraphQL Subscriptions** - Real-time data updates

### Development Tools
- **ESLint** - Code linting and quality checks
- **Vite HMR** - Hot module replacement for fast development

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (version 16 or higher)
- npm or yarn package manager
- NHost account and project setup
- Environment variables configured

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GowriSankar-Ramella/chat-bot.git
   cd chat-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add your NHost configuration:
   ```env
   VITE_NHOST_SUBDOMAIN=your-nhost-subdomain
   VITE_NHOST_REGION=your-nhost-region
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── AuthForm.jsx    # User authentication form
│   ├── ChatList.jsx    # Chat sessions sidebar
│   └── MessageView.jsx # Chat messages and input
├── lib/                # Configuration and utilities
│   ├── apollo.js       # Apollo Client setup
│   └── nhost.js        # NHost client configuration
├── graphql/            # GraphQL queries and mutations
│   └── queries.js      # All GraphQL operations
├── assets/             # Static assets
├── App.jsx             # Main application component
└── main.jsx           # Application entry point
```

## 🎯 Key Components

### AuthForm
- Handles user registration and login
- Form validation and error handling
- Seamless integration with NHost Auth

### ChatList
- Displays all user chat sessions
- Create new chat functionality
- Delete existing chats
- Real-time updates for chat list

### MessageView
- Displays messages for selected chat
- Send new messages
- Real-time message updates via subscriptions
- Auto-scroll to latest messages

## 📡 GraphQL Operations

The application uses several GraphQL operations:

- `GET_CHATS` - Fetch all user chat sessions
- `CREATE_CHAT` - Create a new chat session
- `DELETE_CHAT` - Remove a chat session
- `SEND_MESSAGE` - Send a new message
- `MESSAGES_SUBSCRIPTION` - Real-time message updates

## 🎨 Styling

The application uses TailwindCSS for styling with:
- Responsive design principles
- Modern gradient backgrounds
- Smooth animations and transitions
- Accessible color schemes
- Mobile-first approach

## 🔒 Authentication Flow

1. User visits the application
2. If not authenticated, AuthForm is displayed
3. User can register or login with email/password
4. Upon successful authentication, main chat interface loads
5. Authentication state is managed by NHost React hooks

## 🚀 Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview the production build**
   ```bash
   npm run preview
   ```

The built application will be in the `dist/` directory.

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint checks

### Code Quality

The project uses ESLint for code quality and consistency. Run linting with:
```bash
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/GowriSankar-Ramella/chat-bot/issues) page
2. Create a new issue with detailed information
3. Provide steps to reproduce any bugs

## 🔮 Future Enhancements

- AI chatbot integration
- File and image sharing
- Chat themes and customization
- Push notifications
- Voice messages
- Chat export functionality
