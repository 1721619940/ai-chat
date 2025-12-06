import { useEffect, useState, useRef } from "react";
import api from "../api";
import { getDateLabel } from "../utils/dateLabels";
import { formatTimestamp } from "../utils/formatTime";

export default function Chat({ user, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  // Load chat history on mount
  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await api.get("/chat/history");
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("History load error", err);
      }
    }
    loadHistory();
  }, []);

  // Scroll helper
  function scrollToBottom(smooth = true) {
    if (!bottomRef.current) return;
    bottomRef.current.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  }

  // Auto-scroll or show "new messages" when messages change
  useEffect(() => {
    if (messages.length === 0) return;

    if (isAtBottom) {
      scrollToBottom();
      setHasNewMessages(false);
    } else {
      setHasNewMessages(true);
    }
  }, [messages, loading, isAtBottom]);

  // Track whether user is at the bottom
  function handleScroll() {
    const el = messagesContainerRef.current;
    if (!el) return;

    const threshold = 60; // px from bottom
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    const atBottom = distanceFromBottom < threshold;
    setIsAtBottom(atBottom);

    if (atBottom) {
      setHasNewMessages(false);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const text = input.trim();

    const userMessage = {
      _id: `local-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chat/send", { message: text });

      // Prefer AI message sent back from server (has proper createdAt, _id)
      let aiMessageFromServer = null;
      if (Array.isArray(res.data.messages)) {
        aiMessageFromServer =
          res.data.messages.find((m) => m.role === "assistant") ||
          res.data.messages[res.data.messages.length - 1];
      }

      const aiMessage = aiMessageFromServer || {
        _id: `local-ai-${Date.now()}`,
        role: "assistant",
        content: res.data.reply || "AI replied.",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Send error", err);

      let content = "Error: unable to get AI reply.";

      if (err.response) {
        const status = err.response.status;
        const serverMsg = err.response.data?.message;

        if (status === 429) {
          content =
            serverMsg ||
            "You are sending messages too fast. Please wait a bit before trying again.";
        } else if (serverMsg) {
          content = serverMsg;
        }
      }

      const errorMessage = {
        _id: `error-${Date.now()}`,
        role: "assistant",
        content,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  function handleClickNewMessages() {
    scrollToBottom();
    setIsAtBottom(true);
    setHasNewMessages(false);
  }

  return (
    <div className="chat-layout">
      <header className="chat-header">
        <div>
          <h2>AI Support Chat</h2>
          <span className="user-email">{user.email}</span>
        </div>
        <button className="btn" onClick={onLogout}>
          Logout
        </button>
      </header>

      <main className="chat-main">
        <div
          className="chat-messages"
          ref={messagesContainerRef}
          onScroll={handleScroll}
        >
          {messages.map((m, index) => {
            const currentDateLabel = getDateLabel(m.createdAt);
            const prev = messages[index - 1];
            const prevLabel = prev ? getDateLabel(prev.createdAt) : null;
            const showDateSeparator = currentDateLabel !== prevLabel;

            return (
              <div key={m._id}>
                {showDateSeparator && (
                  <div className="date-separator">
                    <span>{currentDateLabel}</span>
                  </div>
                )}

                <div
                  className={`chat-message ${
                    m.role === "user" ? "from-user" : "from-ai"
                  }`}
                >
                  <div className="chat-bubble">
                    <div className="chat-meta">
                      {m.role === "user" ? "You" : "AI"} •{" "}
                      {formatTimestamp(m.createdAt)}
                    </div>
                    <div className="chat-text">{m.content}</div>
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="chat-message from-ai">
              <div className="chat-bubble typing-bubble">
                <div className="chat-meta">AI</div>
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={bottomRef} />
        </div>

        {/* New messages button when user is scrolled up */}
        {hasNewMessages && !isAtBottom && (
          <button
            type="button"
            className="new-messages-btn"
            onClick={handleClickNewMessages}
          >
            New messages ↓
          </button>
        )}

        <form className="chat-input-bar" onSubmit={handleSend}>
          <input
            className="input chat-input"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? "Thinking..." : "Send"}
          </button>
        </form>
      </main>
    </div>
  );
}
