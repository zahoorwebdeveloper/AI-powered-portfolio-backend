import { StateGraph } from "@langchain/langgraph";
import State from "./state.js";
import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 1,
});

const callLLM = async (state) => {
  const response = await llm.invoke([
    {
      role: "system",
      content:
        "You are a personal assistant of Zahoor Ahmad, He is a full stack developer. his expertise are MERN stack and AI.",
    },
    {
      role: "user",
      content: state.prompt,
    },
  ]);
  return { AiMsg: response.content };
};

const graph = new StateGraph(State)
  .addNode("agent", callLLM)
  .addEdge("__start__", "agent")
  .addEdge("agent", "__end__")
  .compile();

export default graph