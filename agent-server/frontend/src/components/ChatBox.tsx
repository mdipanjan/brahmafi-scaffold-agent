import { useState, useRef, useEffect } from "react";
import styles from "./ChatBox.module.css";

type Message = {
  content: string;
  sender: "user" | "ai";
  tool_calls?: any[];
};

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userInput = input;
    setInput("");

    // Add user message immediately
    setMessages((prev) => [...prev, { content: userInput, sender: "user" }]);
    setIsLoading(true);

    try {
      console.log("Making request to chat API...");
      const response = await fetch("http://localhost:8000/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageReq: userInput,
          threadId: localStorage.getItem("threadId") || `thread-${Date.now()}`,
        }),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      console.log("Starting to read stream...");
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("Stream complete");
          break;
        }

        const chunk = decoder.decode(value);
        console.log("Raw chunk received:", chunk);

        const lines = chunk.split("\n");
        console.log("Split lines:", lines);

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            console.log("Extracted data:", data);

            // Skip if empty line
            if (!data) continue;

            // Handle DONE marker
            if (data === "[DONE]") {
              console.log("Received DONE signal");
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              console.log("Parsed message:", parsed);

              // Handle different message types
              switch (parsed.type) {
                case "connected":
                  console.log("Connection established");
                  break;

                case "message":
                  if (parsed.content) {
                    setMessages((prev) => {
                      const newMessages = [...prev];
                      const lastMessage = newMessages[newMessages.length - 1];

                      if (lastMessage?.sender === "ai") {
                        console.log("Updating existing AI message");
                        lastMessage.content = parsed.content;
                        return [...newMessages];
                      }

                      console.log("Adding new AI message");
                      return [
                        ...newMessages,
                        { content: parsed.content, sender: "ai" },
                      ];
                    });
                  }
                  break;

                case "error":
                  console.error("Received error:", parsed.content);
                  setMessages((prev) => [
                    ...prev,
                    { content: parsed.content, sender: "ai" },
                  ]);
                  break;

                default:
                  console.warn("Unknown message type:", parsed.type);
              }
            } catch (e) {
              if (data !== "[DONE]") {
                console.error("Error parsing message:", e, "Raw data:", data);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { content: "An error occurred. Please try again.", sender: "ai" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.details}>
          <span className={styles.detailsIcon}>ℹ️</span>
          Details
        </div>
      </div>

      <div className={styles.messagesContainer}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.messageWrapper} ${
              message.sender === "user"
                ? styles.userMessageWrapper
                : styles.aiMessageWrapper
            }`}
          >
            {message.sender === "user" ? (
              <div className={styles.userAvatar}>👤</div>
            ) : (
              <div className={styles.aiAvatar}>🤖</div>
            )}
            <div
              className={`${styles.message} ${
                message.sender === "user"
                  ? styles.userMessage
                  : styles.aiMessage
              }`}
            >
              {message.content}
              {message.tool_calls && (
                <div className={styles.toolCalls}>
                  {message.tool_calls.map((tool, i) => (
                    <div key={i} className={styles.toolCall}>
                      Using tool: {tool.function.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div
            className={`${styles.messageWrapper} ${styles.aiMessageWrapper}`}
          >
            <div className={styles.aiAvatar}>🤖</div>
            <div className={`${styles.message} ${styles.aiMessage}`}>
              <div className={styles.loadingDots}>
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI a question or make a request..."
            disabled={isLoading}
            className={styles.input}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={styles.sendButton}
          >
            {isLoading ? "..." : "→"}
          </button>
        </form>
      </div>
    </div>
  );
}
