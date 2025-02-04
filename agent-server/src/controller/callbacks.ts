import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
import { Serialized } from "@langchain/core/load/serializable";
import { LLMResult } from "@langchain/core/outputs";
import { Response } from "express";
import { AgentAction, AgentFinish } from "langchain/agents";

export class StreamingCallbackHandler extends BaseCallbackHandler {
  name = "streaming_handler";

  constructor(private readonly res: Response) {
    super();
  }

  handleLLMNewToken(token: string) {
    // Send the token directly as SSE data
    this.res.write(`data: ${JSON.stringify({ content: token })}\n\n`);
  }

  handleLLMStart(llm: Serialized, prompts: string[]) {
    this.res.write(
      `data: ${JSON.stringify({
        type: "llm_start",
        data: { name: llm.name },
      })}\n\n`
    );
  }

  handleLLMEnd(output: LLMResult) {
    this.res.write(
      `data: ${JSON.stringify({
        type: "llm_end",
        data: { output },
      })}\n\n`
    );
  }

  handleToolStart(tool: Serialized, input: string) {
    this.res.write(
      `data: ${JSON.stringify({
        type: "tool_start",
        data: { tool: tool.name, input },
      })}\n\n`
    );
  }

  handleToolEnd(output: string) {
    this.res.write(
      `data: ${JSON.stringify({
        type: "tool_end",
        data: { output },
      })}\n\n`
    );
  }

  handleAgentAction(action: AgentAction) {
    this.res.write(
      `data: ${JSON.stringify({
        type: "agent_action",
        data: {
          tool: action.tool,
          toolInput: action.toolInput,
          log: action.log,
        },
      })}\n\n`
    );
  }

  handleAgentEnd(action: AgentFinish) {
    this.res.write(
      `data: ${JSON.stringify({
        type: "agent_end",
        data: {
          output: action.returnValues.output,
          log: action.log,
        },
      })}\n\n`
    );
  }
}
