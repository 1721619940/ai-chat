# 🚀 AI Chat Application (Full Stack)

A full-stack AI chat application built using **Node.js (Express)**, **MongoDB**, and **React (Vite)**.  
It includes secure authentication, AI-powered responses, chat history storage, and a modern chat UI with premium UX features.

All **bonus assignment requirements have been completed**.

---

## ✅ Features

### 🔐 Authentication (JWT)
- User Signup
- User Login
- Secure JWT authentication
- Protected chat routes

### 💬 Chat System
- User messages AI & receives smart replies (OpenRouter)
- Full chat history stored in MongoDB
- Beautiful chat experience with:
  - ✨ Typing indicator (animated dots)
  - ✨ Date separators (Today / Yesterday / Custom dates)
  - ✨ Message timestamps
  - ✨ Auto-scroll to latest message
  - ✨ “New Messages ↓” button when scrolled up
  - ✨ WhatsApp/ChatGPT-style bubbles & layout

### 🎁 Bonus Features (Completed)
| Bonus Feature | Status |
|---------------|--------|
| Typing Indicator | ✅ Completed |
| Rate Limiting | ✅ Completed |
| Environment Switching | ✅ Completed |

---

## 🧠 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Express Rate Limit
- OpenRouter AI API

### Frontend
- React (Vite)
- Axios
- Custom CSS (Dark UI)

---

# 📁 Project Structure

```
/
├── client/               # React frontend
├── server/               # Node.js backend
├── .gitignore
├── README.md
└── ai-support-backend.postman_collection.json
```

---

# ⚙️ Setup Instructions

## 1️⃣ Clone Repo

```bash
git clone https://github.com/1721619940/ai-chat.git
cd ai-chat
```

---

# 2️⃣ Backend Setup (`server/`)

```bash
cd server
npm install
```

Create environment file:

```bash
cp .env.example .env
```

Fill in:

- MongoDB URI  
- JWT Secret  
- OpenRouter API key  

Start the backend:

```bash
npm run dev
```

Server runs at:

```
http://localhost:5500
```

---

# 3️⃣ Frontend Setup (`client/`)

```bash
cd client
npm install
```

Create environment file:

```bash
cp .env.example .env
```

Start frontend:

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173  (or another Vite port)
```

---

# 🔌 API Endpoints

## **Auth**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register user |
| POST | `/auth/login` | Login & receive JWT |

## **Chat**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/chat/history` | Fetch chat history (JWT required) |
| POST | `/chat/send` | Send message & get AI response |

---

# 🧪 Testing with Postman

A Postman collection is included:

```
ai-support-backend.postman_collection.json
```

Steps:
1. Import collection
2. Signup → Login
3. Copy JWT from login response
4. Paste into `{{token}}` variable
5. Test chat endpoints

---

# 🌐 Environment Switching (Bonus Complete)

### Backend  
Uses `NODE_ENV` and central config file:

```
server/src/config/config.js
```

- `.env` → development mode  
- `.env.production` → production mode  
- Allows switching of:
  - `MONGODB_URI`
  - `CLIENT_ORIGIN`
  - Rate limits
  - AI model  
  - Secrets

### Frontend  
Uses Vite env files:

```
client/.env.development
client/.env.production
```

Vite automatically loads the correct file during:

- `npm run dev`
- `npm run build`

---

# 🛡️ Rate Limiting (Bonus Complete)

`/chat/send` endpoint uses rate limiting to prevent spam.

If limit is exceeded:
- Backend returns **HTTP 429**
- Frontend shows friendly error:
  ```
  You’ve hit the rate limit. Please wait a few seconds.
  ```

---

# 🎨 Chat UI Features

- Message timestamps  
- Date separators  
- Animated typing indicator  
- Auto scroll-to-bottom on new messages  
- Floating **“New Messages ↓”** button  
- Dark themed layout  
- Chat bubble styling like modern apps  
- Error message handling  

---

# 📌 Future Enhancements (Optional Ideas)

- Multiple chat sessions  
- User profile & settings  
- File upload support  
- Voice message support  
- Theme switcher  

---

# ⭐ If you found this project useful...

Please consider starring the repo — it helps a lot!

---

# 🧑‍💻 Author

Created and maintained by **Dhruv**.
