import { useState, useEffect, useRef } from "react";

export function ChatDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<{ text: string; from: "user" | "bot" }[]>([]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          text: "Hello! I'm your assistant. How can I help you today?",
          from: "bot",
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Scroll to bottom when messages or botTyping changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, botTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { text: input, from: "user" }]);
    setInput("");
    setBotTyping(true);
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { text: "I'm just a demo bot. You said: " + input, from: "bot" },
      ]);
      setBotTyping(false);
    }, 500);
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 90,
        right: 24,
        width: 260,
        height: 320,
        background: "#67728A",
        borderRadius: 12,
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        zIndex: 1400,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontSize: 13,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#CBD5E0",
          padding: "6px 8px 6px 6px",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          minHeight: 32,
          textAlign: "left",
        }}
      >
        <button
          // Remove onClick={onClose} from the avatar button
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 7,
            border: "2px solid #fff",
            padding: 0,
            cursor: "pointer",
            outline: "none",
            boxShadow: "none",
          }}
          tabIndex={0}
          aria-label="Bot avatar"
          onMouseDown={(e) => e.preventDefault()}
        >
          <img
            src="/robot-assistant.png"
            alt="LeadBot"
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              display: "block",
              pointerEvents: "none",
            }}
          />
        </button>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ color: "#333", fontWeight: 600, fontSize: 12, lineHeight: 1 }}>
            NexusAI
          </div>
          <div style={{ display: "flex", alignItems: "center", fontSize: 10, color: "#555", marginTop: 1 }}>
            <style>
              {`
                @keyframes flicker-green {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.3; }
                }
                .no-outline:focus {
                  outline: none !important;
                  box-shadow: none !important;
                }
              `}
            </style>
            <span
              style={{
                display: "inline-block",
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#15803D",
                marginRight: 4,
                border: "1px solid #fff",
                animation: "flicker-green 1.5s infinite",
              }}
            />
            Online Now
          </div>
        </div>
        <button
          onClick={() => { if (onClose) onClose(); }} // Ensure onClose is called
          style={{
            background: "transparent",
            border: "none",
            color: "#333",
            fontSize: 16,
            cursor: "pointer",
            marginLeft: 6,
            padding: 2,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            outline: "none",
            boxShadow: "none",
          }}
          className="no-outline"
          aria-label="Close chat"
          tabIndex={0}
          onMouseDown={(e) => e.preventDefault()}
        >
          <span style={{ fontWeight: 700, fontSize: 18 }}>&times;</span>
        </button>
      </div>
      {/* End Header */}
      <div
        style={{
          padding: 10,
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>
          {`
            .chatbot-messages::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        <div className="chatbot-messages">
          <div style={{ marginTop: 6 }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    color: msg.from === "user" ? "#333" : "#fff",
                    background: msg.from === "user"
                      ? "#fff"
                      : "rgba(255,255,255,0.25)",
                    borderRadius: msg.from === "user"
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                    padding: "6px 10px",
                    maxWidth: "80%",
                    wordBreak: "break-word",
                    display: "inline-block",
                    textAlign: "left",
                    fontSize: 13,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {botTyping && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    color: "#fff",
                    background: "rgba(255,255,255,0.25)",
                    borderRadius: "16px 16px 16px 4px",
                    padding: "6px 10px",
                    maxWidth: "80%",
                    display: "inline-block",
                    fontSize: 13,
                    fontStyle: "italic",
                    letterSpacing: 2,
                  }}
                >
                  ...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", borderTop: "1px solid #CBD5E0", padding: 6, background: "#CBD5E0" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Type your message..."
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: 13,
            padding: 6,
            borderRadius: 4,
            background: "#CBD5E0",
          }}
        />
      </div>
    </div>
  );
}
