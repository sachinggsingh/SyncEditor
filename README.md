# 🚀 SyncEditor

<div align="center">

**A Production-Ready Real-Time Collaborative Code Editor**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-black.svg)](https://socket.io/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Security](https://img.shields.io/badge/security-hardened-blue.svg)]()

*Code together, in real-time, from anywhere*

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### 🎯 Core Capabilities
- **Real-Time Collaboration** - Multiple users editing simultaneously with instant sync
- **Multi-Language Support** - JavaScript, TypeScript, Python, Java, C++ with syntax highlighting
- **Live Code Execution** - Run code directly in the browser with instant output via Piston API
- **Integrated Chat** - Communicate with collaborators without leaving the editor
- **Room-Based Sessions** - Create or join rooms with unique shareable IDs

### 🎨 User Experience
- **Color-Coded Users** - Each user gets a unique color and avatar for easy identification
- **Connection Status** - Real-time connection monitoring
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Dark Theme** - Professional dark theme optimized for coding
- **Resizable Panels** - Customize your workspace layout
- **Monaco Editor** - VS Code-like editing experience

### 🔒 Security & Performance
- **Input Validation** - All user inputs validated and sanitized
- **Rate Limiting** - Protection against abuse and spam
- **Security Headers** - Helmet.js for production security
- **Compression** - Optimized data transfer
- **Error Boundaries** - Graceful error handling

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16.x
- npm >= 8.x

### Installation

```bash
# Clone the repository
git clone https://github.com/sachinggsingh/SyncEditor.git
cd SyncEditor

# Setup Backend
cd Server
npm install
cp .env.example .env
npm run dev

# Setup Frontend (in a new terminal)
cd ../synceditor
npm install
cp .env.example .env
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5555
- **Health Check**: http://localhost:5555/health

---

## 📁 Project Structure

```
SyncEditor/
├── synceditor/              # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── JoinRoom.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── SideBar/
│   │   │   ├── EditorPannel/
│   │   │   └── UI/
│   │   ├── utils/           # Utility functions
│   │   └── socket.js        # Socket.IO manager
│   ├── .env.example         # Environment template
│   └── README.md            # Frontend documentation
│
├── Server/                  # Node.js backend
│   ├── middleware/          # Custom middleware
│   │   ├── rateLimiter.js   # Rate limiting
│   │   └── validator.js     # Input validation
│   ├── app.js               # Express server
│   ├── .env.example         # Environment template
│   └── README.md            # Backend documentation
│
├── CONTRIBUTING.md          # Contribution guidelines
├── LICENSE                  # MIT License
└── README.md                # This file
```

---

## 📚 Documentation

- **[Frontend Documentation](synceditor/README.md)** - React app setup, features, and usage
- **[Backend Documentation](Server/README.md)** - Server API, Socket.IO events, and deployment
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project

---

## 🛠️ Technology Stack

### Frontend
- React 18.3.1 with Hooks
- Vite (Build tool)
- Socket.IO Client
- Monaco Editor / CodeMirror
- Tailwind CSS
- React Router
- React Hot Toast
- Redux Toolkit

### Backend
- Node.js + Express
- Socket.IO
- Helmet (Security)
- Compression
- Validator
- Express Rate Limit
- CORS

---

## 🔐 Security Features

✅ **Input Validation** - All user inputs validated and sanitized  
✅ **Rate Limiting** - API and socket connection limits  
✅ **Security Headers** - Helmet.js protection  
✅ **XSS Protection** - HTML entity escaping  
✅ **CORS Configuration** - Restricted origins  
✅ **Error Handling** - Graceful error boundaries  

---

## 🎯 Use Cases

- **Pair Programming** - Code together in real-time
- **Code Reviews** - Collaborative code review sessions
- **Teaching** - Live coding demonstrations
- **Interviews** - Technical interview platform
- **Hackathons** - Team collaboration during events

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Submit a pull request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - VS Code editor
- [Socket.IO](https://socket.io/) - Real-time communication
- [Piston](https://github.com/engineer-man/piston) - Code execution engine
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

## 📧 Support

For support, please open an issue on GitHub.

---

## 🗺️ Roadmap

- [ ] Persistent room history
- [ ] File upload/download
- [ ] Video/Voice chat
- [ ] Custom themes
- [ ] Admin controls
- [ ] Analytics dashboard

---

<div align="center">

### Made with ❤️ by [Sachin Singh](https://github.com/sachinggsingh)

⭐ Star this repo if you find it helpful!

[Report Bug](https://github.com/sachinggsingh/SyncEditor/issues) • [Request Feature](https://github.com/sachinggsingh/SyncEditor/issues)

</div>
