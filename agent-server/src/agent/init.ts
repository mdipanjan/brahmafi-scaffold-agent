import { ChatGroq } from "@langchain/groq";
import {
  StateGraph,
  MessagesAnnotation,
  START,
  END,
  messagesStateReducer,
} from "@langchain/langgraph";
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { tools } from "../tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { Annotation, type Messages } from "@langchain/langgraph";
import dotenv from "dotenv";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { SYSTEM_PROMPT } from "./prompt";
import { StateAnnotation } from "./state";
import { ChatOpenAI } from "@langchain/openai";

dotenv.config();

// Define state with proper message handling

export async function createAgent() {
  console.log(
    "Creating agent with GROQ API key:",
    process.env.GROQ_API_KEY?.slice(0, 10) + "..."
  );

  // const model = new ChatGroq({
  //   modelName: "llama-3.3-70b-versatile",
  //   temperature: 0,
  //   streaming: true,
  //   apiKey: process.env.GROQ_API_KEY,
  // }).bindTools(tools);
  const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0,
    streaming: true,
    apiKey: process.env.OPENAI_API_KEY,
  }).bindTools(tools);

  // Create chain with specialized prompt
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", SYSTEM_PROMPT],
    new MessagesPlaceholder("messages"),
  ]);

  // Bind model with prompt and tools
  const agentModel = prompt.pipe(model);

  console.log("Model initialized with tools");

  const toolNodeForGraph = new ToolNode(tools);

  // Fix the state type and message handling
  async function callModel(state: typeof StateAnnotation.State) {
    try {
      const response = await agentModel.invoke({
        messages: state.messages, // Pass as an object with messages key
      });
      return { messages: [response] };
    } catch (error) {
      console.error("Error in callModel:", error);
      // Return a default response if there's an error
      return {
        messages: [
          new AIMessage(
            "I apologize, but I encountered an error. Could you please try again?"
          ),
        ],
      };
    }
  }

  // Enhanced continuation logic
  function shouldContinue(state: typeof StateAnnotation.State) {
    const { messages } = state;
    const lastMessage = messages[messages.length - 1];

    if (lastMessage instanceof AIMessage && lastMessage.tool_calls?.length) {
      console.log("Tool calls detected, routing to tools");
      return "tools";
    }
    if (lastMessage instanceof ToolMessage) {
      console.log("Tool response received, routing back to agent");
      return "agent";
    }
    console.log("No tool calls, ending conversation");
    return END;
  }

  // Create workflow with proper state management
  const workflow = new StateGraph(StateAnnotation)
    .addNode("agent", callModel)
    .addNode("tools", toolNodeForGraph)
    .addEdge(START, "agent")
    .addEdge("agent", "tools")
    .addEdge("tools", END);

  console.log("Compiling graph...");
  const app = workflow.compile();

  console.log("Agent creation complete");
  return app;
}
