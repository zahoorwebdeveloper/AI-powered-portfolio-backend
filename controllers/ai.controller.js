import { ChatGroq } from "@langchain/groq";
import { vectorStore } from "../utils/upload.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0,
});

export const AiAgent = async (req, res) => {
  const { input } = req.body;

  const docs = await vectorStore.similaritySearch(input, 3);
  
  const context = docs.map((d) => d.pageContent).join("\n\n");

  try {
    const response = await llm.invoke([
      new SystemMessage(`You are zahoor ahmad's personal assistant
            STRICT RULES:
            - Answer only from context
            - Do not use outside knowledge
            - If answer not found say:
            "I don't know this. Ask me about zahoor ahmad"

            Context:
            ${context}
            `),
      new HumanMessage(input),
    ]);
    return res.status(200).json({
      ai: response.content,
    });
  } catch (error) {
    console.log(error);
  }
};
