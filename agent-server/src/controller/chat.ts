import { createAgent } from "../agent/init";
import { Request, Response } from "express";
import { HumanMessage } from "@langchain/core/messages";

let agent: Awaited<ReturnType<typeof createAgent>>;

export async function initializeAgent() {
  agent = await createAgent();
  console.log("Agent initialized successfully");
}

export const chat: any = async (req: any, res: any) => {
  if (!agent) {
    console.error("Agent not initialized");
    return res.status(500).json({ error: "Agent not initialized" });
  }

  const { messageReq, threadId } = req.body;
  console.log("Received request:", { messageReq, threadId });

  try {
    // Set up SSE headers with full CORS support
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true",
      "X-Accel-Buffering": "no", // Disable nginx buffering
    });

    // Flush headers immediately
    res.flushHeaders();

    // Send initial connection established message
    res.write('data: {"type":"connected"}\n\n');

    // Create initial state with the user's message
    const state = {
      messages: [new HumanMessage(messageReq)],
    };
    console.log("Initial state:", state);

    // Invoke the agent with proper configuration
    console.log("Invoking agent...");
    const result = await agent.invoke(state, {
      configurable: { thread_id: threadId || `thread-${Date.now()}` },
    });
    console.log("Agent result:", result);

    // Stream the response
    if (result.messages && result.messages.length > 0) {
      const lastMessage = result.messages[result.messages.length - 1];
      console.log("Sending message:", lastMessage);

      const response = JSON.stringify({
        type: "message",
        content: lastMessage.content,
      });
      console.log("Sending response:", response);

      // Send the response in SSE format
      res.write(`data: ${response}\n\n`);
    } else {
      console.log("No messages in result:", result);
    }

    // Send end marker
    res.write("data: [DONE]\n\n");

    // Ensure everything is sent before ending
    res.end();
  } catch (error) {
    console.error("Error in chat:", error);
    res.write(
      `data: ${JSON.stringify({
        type: "error",
        content: "Internal server error",
      })}\n\n`
    );
    res.end();
  }
};
